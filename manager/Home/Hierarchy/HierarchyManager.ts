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
import GlobalManager from '../../global/GlobalManager'
import NewUserManager from '../../global/NewUserManager'

class HierarchyManager {
    hierarchyMap: Map<number, Hierarchy> = new Map()
    hierarchy: Hierarchy = null
    currentHierarchyUserId: number = 0
    openHierarchyContextMenu: boolean = false
    isHierarchyOpen: boolean = true

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

    async loadHierarchy (userId: number, nickname: string) {
        this.currentHierarchyUserId = userId
        const exist = this.hierarchyMap.get(userId)
        // 만약 실시간 동기화된 하이어라키면 로드하지 않는다.
        if (exist && exist.websocketProvider) {
            return
        }
        const hierarchy = new Hierarchy(userId, nickname)
        await hierarchy.init()
        this.hierarchyMap.set(userId, hierarchy)
        await EventManager.issueEvent(Event.UpdateHierarchy, {})
    }

    openContextMenu (documentId: string | null) {
        const currentHierarchy = this.hierarchyMap.get(this.currentHierarchyUserId)
        if (!currentHierarchy.editable) {
            return
        }
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
        this._clickPosition = {
            x: GlobalManager.mousePositionX,
            y: GlobalManager.mousePositionY
        }
    }

    closeContextMenu () {
        const currentHierarchy = this.hierarchyMap.get(this.currentHierarchyUserId)
        if (currentHierarchy) {
            currentHierarchy.selectedDocumentId = null
        }
        this.openHierarchyContextMenu = false
    }

    getHierarchyWidth () {
        if (!this.isHierarchyOpen) {
            return 30
        }
        return NewUserManager.setting ? NewUserManager.setting.hierarchyWidth : 240
    }
}
export default new HierarchyManager()
