import { makeAutoObservable } from 'mobx'
import { Setting } from './Setting'

const DEFAULT_SETTING_MAP = new Map<string, Setting>()
DEFAULT_SETTING_MAP.set('profile', new Setting('프로필', true))
DEFAULT_SETTING_MAP.set('hierarchy', new Setting('하이어라키'))
DEFAULT_SETTING_MAP.set('follow', new Setting('팔로우'))

class SettingManager {
    isShowSettingModal: boolean = false
    settingMap = DEFAULT_SETTING_MAP
    settingList = ['profile', 'hierarchy', 'follow']

    constructor () {
        makeAutoObservable(this)
    }

    openSettingModal () {
        this.isShowSettingModal = true
    }

    closeSettingModal () {
        this.isShowSettingModal = false
    }

    updateSettingChildrenOpen (settingID: string, isChildrenOpen: boolean) {
        const setting = this.settingMap.get(settingID)
        setting.isChildrenOpen = isChildrenOpen
        this.settingMap.set(settingID, setting)
    }
}
export default new SettingManager()
