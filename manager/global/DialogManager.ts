import { makeAutoObservable } from 'mobx'

class DialogManager {
    showDialog: boolean = false

    title: string
    description: string
    buttonTexts: string[] =[]
    onClose: (index: number) => void

    constructor () {
        makeAutoObservable(this)
    }

    openDialog (title: string, description: string, buttonTexts: string[]) {
        console.log('openDialog')
        console.log(title)
        this.title = title
        this.description = description
        this.buttonTexts = buttonTexts
        this.showDialog = true
        return new Promise<number>(resolve => {
            this.onClose = (index) => {
                this.showDialog = false
                resolve(index)
            }
        })
    }
}
export default new DialogManager()
