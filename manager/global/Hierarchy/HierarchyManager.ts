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
import { isBrowser } from 'react-device-detect'
import ViewerAPI from '../../../api/ViewerAPI'
import { ESUser } from '@newturn-develop/types-molink'
import { UserNotExists } from '../../../Errors/UserError'

class HierarchyManager {
    hierarchyMap: Map<number, Hierarchy> = new Map()
    hierarchy: Hierarchy = null
    currentHierarchyUserId: number = 0
    openHierarchyContextMenu: boolean = false

    isHierarchyOpen: boolean = false
    isHierarchyOptionOpen: boolean = false

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

    async loadHierarchy (userId: number) {
        this.currentHierarchyUserId = userId
        const exist = this.hierarchyMap.get(userId)
        // 만약 실시간 동기화된 하이어라키면 로드하지 않는다.
        if (exist && exist.websocketProvider) {
            return
        }
        const dto = await ViewerAPI.getUserInfoMapByIDList([userId])
        const userInfo = dto.infoMap[userId] as ESUser
        if (!userInfo) {
            throw new UserNotExists()
        }
        const hierarchy = new Hierarchy(userId, userInfo.nickname, userInfo.profileImageUrl)
        await hierarchy.init()
        this.hierarchyMap.set(userId, hierarchy)
        if (isBrowser) {
            this.isHierarchyOpen = true
        }
        await EventManager.issueEvent(Event.UpdateHierarchy, {})
    }

    openContextMenu (pageId: string | null) {
        const currentHierarchy = this.hierarchyMap.get(this.currentHierarchyUserId)
        if (!currentHierarchy.editable) {
            return
        }
        this.initAvailControlOptions(currentHierarchy, pageId)
        // this._availControlOptions.push(new SettingDocumentListOption(documentId))

        this.openHierarchyContextMenu = true
        this._clickPosition = {
            x: GlobalManager.mousePositionX,
            y: GlobalManager.mousePositionY
        }
    }

    public initAvailControlOptions (hierarchy: Hierarchy, pageId: string | null) {
        hierarchy.selectedPageId = pageId
        this._availControlOptions = []
        this._availControlOptions.push(new CreateNewPageOption(pageId))
        if (pageId) {
            this._availControlOptions.push(new ChangePageNameOption(pageId))
            this._availControlOptions.push(new DeletePageOption(pageId))
        }
    }

    closeContextMenu () {
        const currentHierarchy = this.hierarchyMap.get(this.currentHierarchyUserId)
        if (currentHierarchy) {
            currentHierarchy.selectedPageId = null
        }
        this.openHierarchyContextMenu = false
    }

    getHierarchyWidth () {
        if (!this.isHierarchyOpen) {
            return UserManager.isUserAuthorized ? 30 : 0
        }
        return UserManager.setting ? UserManager.setting.hierarchyWidth : 240
    }
}
export default new HierarchyManager()
