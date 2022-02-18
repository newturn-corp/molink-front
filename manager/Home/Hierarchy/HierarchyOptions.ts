import {
    DocumentVisibility,
    HierarchyDocumentInfoInterface
} from '@newturn-develop/types-molink'
import UserManager from '../../global/UserManager'
import HierarchyManager from './HierarchyManager'
import DialogManager from '../../global/DialogManager'
import RoutingManager, { Page } from '../../global/RoutingManager'
import Hierarchy from './Hierarchy'
import { getUUID } from '../../../utils/getUUID'

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

    getOrder (hierarchy: Hierarchy) {
        if (this.documentId) {
            const block = hierarchy.yMap.get(this.documentId)
            return block.children.length
        } else {
            return hierarchy.yTopLevelDocumentIdList.length
        }
    }

    async handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
        const order = this.getOrder(currentHierarchy)
        const parentId = this.documentId
        const newDocumentId = getUUID()
        const newDocument: HierarchyDocumentInfoInterface = {
            id: newDocumentId,
            title: '',
            icon: '📄',
            userId: UserManager.profile.userId,
            visibility: DocumentVisibility.Private,
            order,
            parentId,
            childrenOpen: false,
            children: []
        }

        currentHierarchy.yjsDocument.transact(() => {
            currentHierarchy.yMap.set(newDocument.id, newDocument)
            if (parentId === null) {
                currentHierarchy.yTopLevelDocumentIdList.insert(order, [newDocument.id])

                for (const [index, documentId] of currentHierarchy.yTopLevelDocumentIdList.toArray().entries()) {
                    const document = currentHierarchy.yMap.get(documentId)
                    document.order = index
                    currentHierarchy.yMap.set(documentId, document)
                }
            } else {
                const parent = currentHierarchy.yMap.get(parentId)
                parent.children.splice(order, 0, newDocument.id)
                for (const [index, documentId] of parent.children.entries()) {
                    const document = currentHierarchy.yMap.get(documentId)
                    document.order = index
                    currentHierarchy.yMap.set(documentId, document)
                }
                parent.childrenOpen = true
                currentHierarchy.yMap.set(parentId, parent)
            }
        })
        currentHierarchy.selectedDocumentId = null
        await RoutingManager.moveTo(Page.Home, `/${currentHierarchy.nickname}?id=${newDocumentId}`)
        // currentHierarchy.nameChangingDocumentId = newDocumentId
        // ReactEditor.focus(editor)
        // Transforms.select(editor, [0, 0])
    }
}

export class ChangeDocumentNameOption extends HierarchyControlOption {
    name = '문서 이름 변경'

    handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
        currentHierarchy.nameChangingDocumentId = this.documentId
    }
}

export class DeleteDocumentOption extends HierarchyControlOption {
    name = '문서 삭제'

    getChildrenCount (hierarchy: Hierarchy, documentId: string) {
        const document = HierarchyManager.hierarchy.yMap.get(documentId)
        return document.children.length + document.children.reduce((prev, current) => {
            return prev + this.getChildrenCount(hierarchy, current)
        }, 0)
    }

    async handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
        const document = currentHierarchy.yMap.get(this.documentId)
        const childrenCount = this.getChildrenCount(currentHierarchy, document.id)
        const msg = childrenCount > 0 ? `${document.title} 문서와 그 하위 문서 ${childrenCount}개를 모두 제거합니다.` : `${document.title} 문서를 제거합니다.`
        const index = await DialogManager.openDialog('문서 삭제', msg, ['확인'])
        if (index !== 0) {
            return
        }

        currentHierarchy.yjsDocument.transact(() => {
            const targetDocument = currentHierarchy.yMap.get(this.documentId)

            if (targetDocument.parentId === null) {
                currentHierarchy.yTopLevelDocumentIdList.delete(targetDocument.order, 1)
                for (const [index, documentId] of currentHierarchy.yTopLevelDocumentIdList.toArray().entries()) {
                    const document = currentHierarchy.yMap.get(documentId)
                    document.order = index
                    currentHierarchy.yMap.set(documentId, document)
                }
            } else {
                const parent = currentHierarchy.yMap.get(targetDocument.parentId)
                parent.children.splice(targetDocument.order, 1)
                for (const [index, childId] of parent.children.entries()) {
                    const document = currentHierarchy.yMap.get(childId)
                    document.order = index
                    currentHierarchy.yMap.set(childId, document)
                }
                currentHierarchy.yMap.set(targetDocument.parentId, parent)
            }
        })
        currentHierarchy.selectedDocumentId = null
    }
}

export class SettingDocumentListOption extends HierarchyControlOption {
    name = '문서 목록 설정'

    handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
        currentHierarchy.selectedDocumentId = null
        RoutingManager.moveTo(Page.SettingDocumentList)
    }
}
