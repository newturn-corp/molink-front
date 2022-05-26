import { makeAutoObservable } from 'mobx'

class ModalManager {
    openShouldLoginNoticeModal: boolean = false

    constructor () {
        makeAutoObservable(this)
    }
}
export default new ModalManager()
