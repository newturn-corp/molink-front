import { makeAutoObservable, toJS } from 'mobx'
import {
    ChangeDocumentNameOption,
    CreateNewDocumentOption,
    DeleteDocumentOption,
    HierarchyControlOption, SettingDocumentListOption
} from './HierarchyOptions'
import Hierarchy from './Hierarchy'
import React from 'react'
import EventManager, { Event } from '../../EventManager'

class HierarchyManager {
    hierarchyMap: Map<string, Hierarchy> = new Map()
    hierarchy: Hierarchy = null
    currentHierarchyNickname: string = ''
    openHierarchyContextMenu: boolean = false

    private _clickPosition: { x: number, y: number } = { x: 0, y: 0 }
    get clickPosition () {
        return toJS(this._clickPosition)
    }

    private _availControlOptions: HierarchyControlOption[] = []
    get availControlOptions () {
        return toJS(this._availControlOptions)
    }

    constructor () {
        makeAutoObservable(this)
    }

    async loadHierarchy (nickname: string) {
        this.currentHierarchyNickname = nickname
        const exist = this.hierarchyMap.get(nickname)
        // 만약 실시간 동기화된 하이어라키면 로드하지 않는다.
        if (exist && exist.websocketProvider) {
            return
        }
        const hierarchy = new Hierarchy(nickname)
        await hierarchy.init()
        this.hierarchyMap.set(nickname, hierarchy)
        await EventManager.issueEvent(Event.UpdateHierarchy, {})
    }

    handleRightClick (event: React.MouseEvent<HTMLElement, MouseEvent>, documentId: string | null) {
        const currentHierarchy = this.hierarchyMap.get(this.currentHierarchyNickname)
        if (!currentHierarchy.editable) {
            return
        }
        event.preventDefault()
        event.stopPropagation()
        currentHierarchy.selectedDocumentId = documentId

        this._availControlOptions = []
        if (currentHierarchy.editable) {
            this._availControlOptions.push(new CreateNewDocumentOption(documentId))
            if (document) {
                this._availControlOptions.push(new ChangeDocumentNameOption(documentId))
                this._availControlOptions.push(new DeleteDocumentOption(documentId))
            }
        }
        this._availControlOptions.push(new SettingDocumentListOption(documentId))

        this.openHierarchyContextMenu = true
        this._clickPosition = { x: event.clientX, y: event.clientY }
    }

    closeContextMenu () {
        if (this.hierarchy) {
            this.hierarchy.selectedDocumentId = null
        }
        this.openHierarchyContextMenu = false
    }
}
export default new HierarchyManager()
