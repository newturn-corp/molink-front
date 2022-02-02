import {
    GetHierarcyResponseDTO,
    HierarchyChildrenOpenInfoInterface,
    HierarchyDocumentInfoInterface,
    HierarchyInfoInterface
} from '@newturn-develop/types-molink'
import Automerge from 'automerge'
import { makeAutoObservable } from 'mobx'
import { AutomergeChangeEventDTO } from '@newturn-develop/types-molink/dist/DTO'
import HierarchySynchronizer, { HierarchyChangeType } from './HierarchySynchronizer'
import { v4 as uuidv4 } from 'uuid'
import {
    convertAutomergeChangesThroughNetwork,
    getAutomergeDocumentThroughNetwork
} from '@newturn-develop/molink-automerge-wrapper'

export default class Hierarchy {
    hierarchyValue: Automerge.FreezeObject<HierarchyInfoInterface> = null
    set automergeHierarchy (value: Automerge.FreezeObject<HierarchyInfoInterface>) {
        this.hierarchyValue = value
        this.topLevelDocumentIdList = value.topLevelDocumentIdList
        this.map = value.map
    }

    topLevelDocumentIdList: string[] = []
    map: {
        [index: string]: HierarchyDocumentInfoInterface
    }

    childrenOpenMapValue: Automerge.FreezeObject<HierarchyChildrenOpenInfoInterface> = null

    set automergeChildrenOpenMap (value: Automerge.FreezeObject<HierarchyChildrenOpenInfoInterface>) {
        this.childrenOpenMapValue = value
        this.childrenOpenMap = value.map
    }

    childrenOpenMap: {
        [index: string]: boolean
    } = {}

    nameChangingDocumentId: string | null = null
    selectedDocumentId: string | null = null
    openedDocumentId: string | null = null
    object: HierarchyInfoInterface = null

    constructor (dto: GetHierarcyResponseDTO) {
        makeAutoObservable(this, {
            hierarchyValue: false,
            childrenOpenMapValue: false
        })
        this.automergeHierarchy = getAutomergeDocumentThroughNetwork(dto.hierarchy)
        this.automergeChildrenOpenMap = getAutomergeDocumentThroughNetwork(dto.hierarchyChildrenOpen)
    }

    public update (changes: Automerge.BinaryChange[]) {
        const [newHierarchy] = Automerge.applyChanges(this.hierarchyValue, changes)
        this.automergeHierarchy = newHierarchy
    }

    public updateChildrenOpenMap (changes: Automerge.BinaryChange[]) {
        const [newMap] = Automerge.applyChanges(this.childrenOpenMapValue, changes)
        this.automergeChildrenOpenMap = newMap
    }

    public updateHierarchyChildrenOpen (id: string, isOpen: boolean) {
        const newChildrenOpenMap = Automerge.change(this.childrenOpenMapValue, (childrenOpenMap) => {
            if (isOpen) {
                childrenOpenMap.map[id] = isOpen
            } else {
                delete childrenOpenMap.map[id]
            }
            childrenOpenMap.lastUsedAt = new Date()
        })
        const changes = Automerge.getChanges(this.childrenOpenMapValue, newChildrenOpenMap)
        this.automergeChildrenOpenMap = newChildrenOpenMap
        HierarchySynchronizer.sendChange(HierarchyChangeType.HierarchyChildrenOpen, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
    }

    public updateDocumentTitle (id: string, title: string) {
        const newHierarchy = Automerge.change(this.hierarchyValue, hierarchy => {
            hierarchy.map[id].title = title
        })
        const changes = Automerge.getChanges(this.hierarchyValue, newHierarchy)
        this.automergeHierarchy = newHierarchy
        HierarchySynchronizer.sendChange(HierarchyChangeType.Hierarchy, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
        this.selectedDocumentId = null
        this.nameChangingDocumentId = null
    }

    public updateDocumentLocation (id: string, parentId: string | null, order: number) {
        const newHierarchy = Automerge.change(this.hierarchyValue, hierarchy => {
            const document = hierarchy.map[id]

            // 기존 부모에서 제거하고 order 조정
            if (!document.parentId) {
                hierarchy.topLevelDocumentIdList.splice(document.order, 1)
                for (const [index, documentId] of hierarchy.topLevelDocumentIdList.entries()) {
                    const siblingDocument = hierarchy.map[documentId]
                    siblingDocument.order = index
                }
            } else {
                const parent = hierarchy.map[document.parentId]
                parent.children.splice(document.order, 1)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = hierarchy.map[documentId]
                    siblingDocument.order = index
                }
            }
            // 새로운 부모에 추가하고 order 조정
            if (!parentId) {
                hierarchy.topLevelDocumentIdList.splice(order, 0, id)
                for (const [index, documentId] of hierarchy.topLevelDocumentIdList.entries()) {
                    const siblingDocument = hierarchy.map[documentId]
                    siblingDocument.order = index
                }
            } else {
                const parent = hierarchy.map[parentId]
                parent.children.splice(order, 0, id)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = hierarchy.map[documentId]
                    siblingDocument.order = index
                }
            }
            document.parentId = parentId
            document.order = order
            hierarchy.lastUsedAt = new Date()
        })
        const changes = Automerge.getChanges(this.hierarchyValue, newHierarchy)
        this.automergeHierarchy = newHierarchy
        HierarchySynchronizer.sendChange(HierarchyChangeType.Hierarchy, new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
    }

    public getSibling (documentId: string, order: number) {
        const document = this.map[documentId]
        if (!document.parentId) {
            return this.map[this.topLevelDocumentIdList[order]]
        } else {
            return this.map[this.map[document.parentId].children[order]]
        }
    }

    setSelectedDocumentId (documentId: string) {
        this.selectedDocumentId = documentId
    }

    setOpenedDocumentId (documentId: string) {
        this.openedDocumentId = documentId
    }
}
