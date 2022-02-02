import { AutomergeChangeEventDTO } from '@newturn-develop/types-molink/dist/DTO'
import {
    DocumentVisibility,
    HierarchyDocumentInfoInterface,
    HierarchyInfoInterface
} from '@newturn-develop/types-molink'
import { v4 as uuidv4 } from 'uuid'
import UserManager from '../../global/UserManager'
import Automerge from 'automerge'
import HierarchySynchronizer, { HierarchyChangeType } from './HierarchySynchronizer'
import HierarchyManager from './HierarchyManager'
import { convertAutomergeChangesThroughNetwork } from '@newturn-develop/molink-automerge-wrapper'
import DialogManager from '../../global/DialogManager'
import RoutingManager, { Page } from '../../global/RoutingManager'

export abstract class HierarchyControlOption {
    name: string = ''
    documentId: string | null

    constructor (documentId: string | null) {
        this.documentId = documentId
    }

    abstract handleOnClick ()
}

export class CreateNewDocumentOption extends HierarchyControlOption {
    constructor (documentId: string | null) {
        super(documentId)
        this.name = documentId ? '하위 문서 생성' : '문서 생성'
    }

    getOrder () {
        if (this.documentId) {
            const block = HierarchyManager.hierarchy.map[this.documentId]
            return block.children.length
        } else {
            return HierarchyManager.hierarchy.topLevelDocumentIdList.length
        }
    }

    async handleOnClick () {
        const order = this.getOrder()
        const parentId = this.documentId
        const newDocumentId = uuidv4()

        const newDocument: HierarchyDocumentInfoInterface = {
            id: newDocumentId,
            title: '',
            icon: '📄',
            userId: UserManager.profile.userId,
            visibility: DocumentVisibility.Private,
            order,
            parentId,
            children: []
        }
        const newHierarchy = Automerge.change(HierarchyManager.hierarchy.hierarchyValue, hierarchy => {
            hierarchy.map[newDocument.id] = newDocument
            if (parentId === null) {
                hierarchy.topLevelDocumentIdList.splice(order, 0, newDocument.id)
                for (const [index, documentId] of hierarchy.topLevelDocumentIdList.entries()) {
                    hierarchy.map[documentId].order = index
                }
            } else {
                const parent = hierarchy.map[parentId]
                parent.children.splice(order, 0, newDocument.id)
                for (const [index, documentId] of parent.children.entries()) {
                    hierarchy.map[documentId].order = index
                }
            }
            hierarchy.lastUsedAt = new Date()
        })
        const changes = Automerge.getChanges(HierarchyManager.hierarchy.hierarchyValue, newHierarchy)
        HierarchyManager.hierarchy.automergeHierarchy = newHierarchy
        HierarchySynchronizer.sendChange(HierarchyChangeType.Hierarchy, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
        await HierarchySynchronizer.sendCreateDocument(newDocumentId)
        HierarchyManager.hierarchy.setSelectedDocumentId(null)

        // 만약 부모가 있으면 부모 열기
        if (newDocument.parentId) {
            const newChildrenOpenMap = Automerge.change(HierarchyManager.hierarchy.childrenOpenMapValue, childrenOpenMap => {
                childrenOpenMap.map[newDocument.parentId] = true
                childrenOpenMap.lastUsedAt = new Date()
            })
            const changes = Automerge.getChanges(HierarchyManager.hierarchy.childrenOpenMapValue, newChildrenOpenMap)
            HierarchyManager.hierarchy.automergeChildrenOpenMap = newChildrenOpenMap
            HierarchySynchronizer.sendChange(HierarchyChangeType.HierarchyChildrenOpen, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
        }

        HierarchyManager.hierarchy.nameChangingDocumentId = newDocumentId
        await RoutingManager.moveTo(Page.Home, `/${HierarchyManager.nickname}?id=${newDocumentId}`)
        // ReactEditor.focus(editor)
        // Transforms.select(editor, [0, 0])
    }
}

export class ChangeDocumentNameOption extends HierarchyControlOption {
    name = '문서 이름 변경'

    handleOnClick () {
        HierarchyManager.hierarchy.nameChangingDocumentId = this.documentId
    }
}

export class DeleteDocumentOption extends HierarchyControlOption {
    name = '문서 삭제'

    getChildrenCount (documentId: string) {
        const document = HierarchyManager.hierarchy.map[documentId]
        return document.children.length + document.children.reduce((prev, current) => {
            return prev + this.getChildrenCount(current)
        }, 0)
    }

    deleteChildren (hierarchy: HierarchyInfoInterface, documentId: string) {
        const document = hierarchy.map[documentId]
        for (const childId of document.children) {
            this.deleteChildren(hierarchy, childId)
        }
        delete hierarchy.map[documentId]
    }

    removeDocumentAtHierarchy () {
        const newHierarchy = Automerge.change(HierarchyManager.hierarchy.hierarchyValue, hierarchy => {
            const targetDocument = hierarchy.map[this.documentId]

            if (targetDocument.parentId === null) {
                hierarchy.topLevelDocumentIdList.splice(targetDocument.order, 1)
                for (const [index, documentId] of hierarchy.topLevelDocumentIdList.entries()) {
                    hierarchy.map[documentId].order = index
                }
            } else {
                const parent = hierarchy.map[targetDocument.parentId]
                parent.children.splice(targetDocument.order, 1)
                for (const [index, childId] of parent.children.entries()) {
                    hierarchy.map[childId].order = index
                }
            }

            this.deleteChildren(hierarchy, targetDocument.id)
        })
        const changes = Automerge.getChanges(HierarchyManager.hierarchy.hierarchyValue, newHierarchy)
        HierarchyManager.hierarchy.automergeHierarchy = newHierarchy
        HierarchySynchronizer.sendChange(HierarchyChangeType.Hierarchy, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
    }

    removeDocumentAtChildrenOpen () {
        const newChildrenOpen = Automerge.change(HierarchyManager.hierarchy.childrenOpenMapValue, childrenOpen => {
            delete childrenOpen.map[this.documentId]
        })
        const changes = Automerge.getChanges(HierarchyManager.hierarchy.childrenOpenMapValue, newChildrenOpen)
        HierarchyManager.hierarchy.automergeChildrenOpenMap = newChildrenOpen
        HierarchySynchronizer.sendChange(HierarchyChangeType.HierarchyChildrenOpen, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
    }

    async handleOnClick () {
        const document = HierarchyManager.hierarchy.map[this.documentId]
        const childrenCount = this.getChildrenCount(document.id)
        const msg = childrenCount > 0 ? `${document.title} 문서와 그 하위 문서 ${childrenCount}개를 모두 제거합니다.` : `${document.title} 문서를 제거합니다.`
        const index = await DialogManager.openDialog('문서 삭제', msg, ['확인'])
        if (index !== 0) {
            return
        }

        this.removeDocumentAtHierarchy()
        this.removeDocumentAtChildrenOpen()
        HierarchyManager.hierarchy.selectedDocumentId = null
    }
}

export class SettingDocumentListOption extends HierarchyControlOption {
    name = '문서 목록 설정'

    handleOnClick () {
        HierarchyManager.hierarchy.selectedDocumentId = null
        RoutingManager.moveTo(Page.SettingDocumentList)
    }
}
