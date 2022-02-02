import { makeAutoObservable, toJS } from 'mobx'
import ViewerAPI from '../../../api/ViewerAPI'
import {
    ChangeDocumentNameOption,
    CreateNewDocumentOption,
    DeleteDocumentOption,
    HierarchyControlOption, SettingDocumentListOption
} from './HierarchyOptions'
import Hierarchy from './Hierarchy'
import React from 'react'
import UserManager from '../../global/UserManager'
import HierarchySynchronizer from './HierarchySynchronizer'
import EventManager, { Event } from '../../EventManager'

class HierarchyManager {
    hierarchy: Hierarchy = null
    nickname: string = ''

    editable: boolean = false
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
        const dto = await ViewerAPI.getDocumentsHierarchy(nickname)
        this.nickname = nickname
        this.hierarchy = new Hierarchy(dto)
        this.editable = UserManager.profile && UserManager.profile.nickname === nickname
        if (UserManager.isUserAuthorized) {
            await HierarchySynchronizer.connect(nickname)
        }
        await EventManager.issueEvent(Event.UpdateHierarchy, {})
    }

    handleRightClick (event: React.MouseEvent<HTMLElement, MouseEvent>, documentId: string | null) {
        if (!this.editable) {
            return
        }
        event.preventDefault()
        event.stopPropagation()
        this.hierarchy.setSelectedDocumentId(documentId)

        this._availControlOptions = []
        if (this.editable) {
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
            this.hierarchy.setSelectedDocumentId(null)
        }
        this.openHierarchyContextMenu = false
    }
}
export default new HierarchyManager()
