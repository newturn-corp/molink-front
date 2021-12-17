import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import Document from '../domain/Document'
import ContentManager from './ContentManager'
class DocumentManager {
    documents: Document[] = []
    currentContent: string

    constructor () {
        makeAutoObservable(this)
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
    }

    async deleteDocument (document: Document) {
        await DocumentAPI.deleteDocument(document)
    }
}
export default new DocumentManager()
