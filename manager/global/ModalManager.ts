import { makeAutoObservable } from 'mobx'
import LanguageManager from './LanguageManager'
import RoutingManager, { Page } from './RoutingManager'

export enum Modal {
    UserSetting,
    BlogSetting,
    EmailValidating,
    Tutorial,
    Default,
    ShouldLoginNotice
}

export class ModalButton {
    text: string
    onClick: Function

    constructor (text: string, onClick: Function) {
        this.text = text
        this.onClick = onClick
    }
}

class ModalManager {
    map: Map<Modal, boolean> = null
    defaultModalDescription: string = ''
    defaultModalTitle: string = ''
    defaultModalButtons: ModalButton[] = []

    constructor () {
        this.map = new Map<Modal, boolean>()
        this.map.set(Modal.UserSetting, false)
        this.map.set(Modal.BlogSetting, false)
        this.map.set(Modal.EmailValidating, false)
        this.map.set(Modal.Tutorial, false)
        this.map.set(Modal.Default, false)
        makeAutoObservable(this)
    }

    open (modal: Modal) {
        if (modal === Modal.ShouldLoginNotice) {
            return this.openDefaultModal('로그인 필요', '로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?', [new ModalButton(LanguageManager.languageMap.Accept, () => {
                this.close(Modal.Default)
                RoutingManager.moveTo(Page.SignIn)
            })])
        }
        this.map.set(modal, true)
    }

    openDefaultModal (title: string, description: string, buttons: ModalButton[]) {
        this.defaultModalTitle = title
        this.defaultModalDescription = description
        this.defaultModalButtons = buttons
        this.open(Modal.Default)
    }

    close (modal: Modal) {
        this.map.set(modal, false)
    }
}
export default new ModalManager()
