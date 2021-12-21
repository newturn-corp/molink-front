import { makeAutoObservable } from 'mobx'

class DialogManager {
    showDialog: boolean = false

    title: string
    description: string
    onClose: Function

    constructor () {
        makeAutoObservable(this)
    }

    openDialog (title: string, description: string, onClose: Function) {
        this.title = title
        this.description = description
        this.onClose = onClose
        this.showDialog = true
    }
}
export default new DialogManager()
