import { HierarchyChangeEventDTO, HierarchyInfoInterface } from '@newturn-develop/types-molink'
import Automerge from 'automerge'
import { makeAutoObservable } from 'mobx'
import EventManager, { Event } from '../../EventManager'

export default class Hierarchy {
    _automergeHierarchy: Automerge.FreezeObject<HierarchyInfoInterface> = null
    // eslint-disable-next-line accessor-pairs
    set automergeHierarchy (value: Automerge.FreezeObject<HierarchyInfoInterface>) {
        this._automergeHierarchy = value
        this.object = JSON.parse(JSON.stringify(this._automergeHierarchy))
    }

    private nameChangingDocumentId: string | null = null
    private selectedDocumentId: string | null = null
    private openedDocumentId: string | null = null
    object: HierarchyInfoInterface = null

    constructor (serializedAutomergeDocument: number[]) {
        makeAutoObservable(this, {
            _automergeHierarchy: false
        })
        const arr = Uint8Array.from(serializedAutomergeDocument) as any
        arr.__binaryDocument = true
        this.automergeHierarchy = Automerge.load(arr)
    }

    update (dto: HierarchyChangeEventDTO) {
        const [newHierarchy] = Automerge.applyChanges(this._automergeHierarchy, dto.changes)
        this.automergeHierarchy = newHierarchy
        EventManager.issueEvent(Event.UpdateHierarchy, {})
    }

    checkIsDocumentChangingName (documentId: string) {
        return this.nameChangingDocumentId === documentId
    }

    setNameChangingDocumentId (documentId: string) {
        this.nameChangingDocumentId = documentId
    }

    checkIsDocumentSelected (documentId: string) {
        return this.selectedDocumentId === documentId
    }

    setSelectedDocumentId (documentId: string) {
        this.selectedDocumentId = documentId
    }

    checkIsDocumentOpened (documentId: string) {
        return this.openedDocumentId === documentId
    }

    setOpenedDocumentId (documentId: string) {
        this.openedDocumentId = documentId
    }

    getDocument (documentId: string) {
        return this._automergeHierarchy.map[documentId]
    }

    getDocumentHierarchyBlockById (documentId: string) {
        const document = this._automergeHierarchy.map[documentId]
        const location = document.location.split(',').map(index => Number(index))
        const block = this._automergeHierarchy.list[location.shift()]
        return location.reduce((prev, current) => {
            return prev.children[current]
        }, block)
    }

    getList () {
        return this._automergeHierarchy.list
    }

    getMap () {
        return this._automergeHierarchy.map
    }
}
