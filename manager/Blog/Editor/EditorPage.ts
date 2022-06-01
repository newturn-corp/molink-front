import { makeAutoObservable } from 'mobx'

class EditorPage {
    pageId: string
    constructor () {
        makeAutoObservable(this)
    }

    handleEnter (pageId: string) {
        this.pageId = pageId
    }
}
export default new EditorPage()
