import {
    HierarchyChangeEventDTO, HierarchyChildrenOpenInfoInterface,
    HierarchyComponentBlockInterface,
    HierarchyInfoInterface,
    HierarchyDocumentInfoInterface
} from '@newturn-develop/types-molink'
import Automerge from 'automerge'
import { makeAutoObservable, observable } from 'mobx'
import EventManager, { Event } from '../../EventManager'
import { getAutomergeDocumentThroughRestAPI } from '../../../utils/AutomeregeConverter'
import { AutomergeChangeEventDTO } from '@newturn-develop/types-molink/dist/DTO'

export default class Hierarchy {
    value: Automerge.FreezeObject<HierarchyInfoInterface> = null
    set automergeHierarchy (value: Automerge.FreezeObject<HierarchyInfoInterface>) {
        this.value = value
        this.list = value.list
        this.map = value.map
    }

    list: HierarchyComponentBlockInterface[] = []
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
    }

    nameChangingDocumentId: string | null = null
    selectedDocumentId: string | null = null
    openedDocumentId: string | null = null
    object: HierarchyInfoInterface = null

    constructor (serializedAutomergeDocument: number[], serializedChildrenOpenMap: number[]) {
        makeAutoObservable(this, {
            value: false,
            childrenOpenMapValue: false
        })
        this.automergeHierarchy = getAutomergeDocumentThroughRestAPI(serializedAutomergeDocument)
        this.automergeChildrenOpenMap = getAutomergeDocumentThroughRestAPI(serializedChildrenOpenMap)
    }

    update (dto: HierarchyChangeEventDTO) {
        const [newHierarchy] = Automerge.applyChanges(this.value, dto.changes)
        this.automergeHierarchy = newHierarchy
    }

    updateChildrenOpenMap (dto: AutomergeChangeEventDTO) {
        const [newMap] = Automerge.applyChanges(this.childrenOpenMapValue, dto.changes)
        this.automergeChildrenOpenMap = newMap
    }

    setNameChangingDocumentId (documentId: string) {
        this.nameChangingDocumentId = documentId
    }

    setSelectedDocumentId (documentId: string) {
        this.selectedDocumentId = documentId
    }

    setOpenedDocumentId (documentId: string) {
        this.openedDocumentId = documentId
    }

    getDocumentHierarchyBlockById (documentId: string) {
        const document = this.map[documentId]
        const location = document.location.split(',').map(index => Number(index))
        const block = this.list[location.shift()]
        return location.reduce((prev, current) => {
            return prev.children[current]
        }, block)
    }
}
