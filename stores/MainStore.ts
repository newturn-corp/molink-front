import { makeAutoObservable, runInAction } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
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
            this.documents = await DocumentAPI.getDocuments()
        })
    }
}

export default new MainStore()
