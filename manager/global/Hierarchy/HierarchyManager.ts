import { makeAutoObservable, toJS } from 'mobx'
import {
    ChangePageNameOption,
    CreateNewPageOption,
    DeletePageOption,
    HierarchyControlOption, SettingDocumentListOption
} from './HierarchyOptions'
import Hierarchy from './Hierarchy'
import GlobalManager from '../../global/GlobalManager'
import UserManager from '../User/UserManager'
import { Event } from '../Event/Event'
import EventManager from '../Event/EventManager'

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
        EventManager.addEventListener(
            Event.PageBodyClick,
            () => this.closeContextMenu(),
            1
        )
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
            this._availControlOptions.push(new CreateNewPageOption(documentId))
            if (documentId) {
                this._availControlOptions.push(new ChangePageNameOption(documentId))
                this._availControlOptions.push(new DeletePageOption(documentId))
            }
        }
        // this._availControlOptions.push(new SettingDocumentListOption(documentId))

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
        return UserManager.setting ? UserManager.setting.hierarchyWidth : 240
    }
}
export default new HierarchyManager()
