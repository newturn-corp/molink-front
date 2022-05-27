import { makeAutoObservable } from 'mobx'
import { Setting } from './Setting'
import LanguageManager from '../LanguageManager'

const DEFAULT_SETTING_MAP = new Map<string, Setting>()
DEFAULT_SETTING_MAP.set('profile', new Setting(LanguageManager.languageMap.Profile, true))
DEFAULT_SETTING_MAP.set('hierarchy', new Setting(LanguageManager.languageMap.Blog))
DEFAULT_SETTING_MAP.set('follow', new Setting(LanguageManager.languageMap.Follow))

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
