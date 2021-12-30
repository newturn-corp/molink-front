import { makeAutoObservable } from 'mobx'

class HoveringToolbarManager {
    showLinkInput: boolean = false

    constructor () {
        makeAutoObservable(this)
    }
}

export default new HoveringToolbarManager()
