import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import Document from '../domain/Document'
import ContentManager from './home/ContentManager'
import EventManager from './home/EventManager'

// 특정 Document의 대한 변화를 추적해서 서버로 반영하는 역할
class DocumentManager {
    documents: Document[] = []

    constructor () {
        makeAutoObservable(this)
        EventManager.deleteDocumentListener.push((document: Document) => this.deleteDocument(document))
        EventManager.openDocumentChildrenListener.push((document: Document, value: boolean) => this.openDocumentChildren(document, value))
        EventManager.changeDocumentIconListeners.push((document: Document, icon: string) => this.setDocumentIcon(document, icon))
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

    async setDocumentIcon (document: Document, icon: string) {
        document.icon = icon
        await DocumentAPI.setDocumentIcon(document)
    }

    async deleteDocument (document: Document) {
        await DocumentAPI.deleteDocument(document)
    }

    async openDocumentChildren (document: Document, value: boolean) {
        document.isChildrenOpen = value
        await DocumentAPI.setDocumentIsChildrenOpen(document)
    }
}
export default new DocumentManager()
