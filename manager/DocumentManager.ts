import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import Document from '../domain/Document'
import ContentManager from './home/ContentManager'
import EventManager from './home/EventManager'
class DocumentManager {
    documents: Document[] = []

    constructor () {
        makeAutoObservable(this)
        EventManager.deleteDocumentListener.push((document: Document) => this.deleteDocument(document))
    }

    async init () {
        this.documents = await DocumentAPI.getDocuments()
    }

    async createDocument (document: Document) {
        const id = await DocumentAPI.createDocument(document)
        document.id = id
    }

    async setDocumentTitle (document: Document) {
        await DocumentAPI.setDocumentTitle(document)
        ContentManager.renameByFileSystem(document)
    }

    async deleteDocument (document: Document) {
        console.log('DocumentManager 호출')
        await DocumentAPI.deleteDocument(document)
    }
}
export default new DocumentManager()
