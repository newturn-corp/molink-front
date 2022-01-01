import { makeAutoObservable } from 'mobx'

class EditorManager {
    showPlaceholder: boolean = false

    constructor () {
        makeAutoObservable(this)
    }
}
export default new EditorManager()
