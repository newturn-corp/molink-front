import { makeAutoObservable } from 'mobx'

export enum Modal {
    UserSetting,
    BlogSetting
}

class ModalManager {
    openShouldLoginNoticeModal: boolean = false
    openTutorialModal: boolean = false
    openSettingModal: boolean = false

    map: Map<Modal, boolean> = null

    constructor () {
        this.map = new Map<Modal, boolean>()
        this.map.set(Modal.UserSetting, false)
        this.map.set(Modal.BlogSetting, false)
        makeAutoObservable(this)
    }

    open (modal: Modal) {
        this.map.set(modal, true)
    }

    close (modal: Modal) {
        this.map.set(modal, false)
    }
}
export default new ModalManager()
