import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import Document from '../domain/Document'
import ContentManager from './ContentManager'
class DocumentManager {
    // documents: Document[] = []
    // constructor () {
    //     makeAutoObservable(this)
    //     this.init()
    // }

    // setParent (document: Document) {
    //     document.children.forEach(child => {
    //         child.parent = document
    //         this.setParent(child)
    //     })
    // }

    // async init () {
    //     this.documents = await DocumentAPI.getDocuments()
    //     // this.documents.forEach(doc => {
    //     //     this.setParent(doc)
    //     // })
    //     ContentManager.openDocument(this.documents[0])
    // }

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
