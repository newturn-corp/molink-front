import { makeAutoObservable, runInAction } from 'mobx'
import MainAPI from '../api/mainAPI'
import Document from '../domain/Document'
import ContentManager from '../manager/ContentManager'

class MainStore {
    documents: Document[] = []
    currentContent: string

    constructor () {
        makeAutoObservable(this)
        this.init()
    }

    setParent (document: Document) {
        document.children.forEach(child => {
            child.parent = document
            this.setParent(child)
        })
    }

    async init () {
        runInAction(async () => {
            this.documents = await MainAPI.getDocuments()
            await ContentManager.openDocument(this.documents[0])
            // this.documents.forEach(doc => {
            //     this.setParent(doc)
            // })
        })
    }
}

export default new MainStore()
