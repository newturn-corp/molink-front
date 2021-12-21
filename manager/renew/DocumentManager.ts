import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../../api/renew/DocumentAPI'
import Document from '../../domain/renew/Document'
import EventManager, { Event } from '../home/EventManager'
import FileSystemManager from './FileSystemManager'

// 특정 Document의 대한 변화를 추적해서 서버로 반영하는 역할
class DocumentManager {
    documentMap: Map<string, Document> = new Map<string, Document>()

    constructor () {
        EventManager.addEventLinstener(Event.UserProfileInited, () => this.init(), 2)
        makeAutoObservable(this)
    }

    async init () {
        const initialInfoDTOList = await DocumentAPI.getDocumentInitialInfoList()
        const documents = initialInfoDTOList.map(infoDTO => new Document(infoDTO))
        const tempMap = new Map<string, Document>()
        documents.forEach(document => {
            tempMap.set(document.meta.id, document)
            this.documentMap.set(document.meta.id, document)
        })
        documents.filter(document => document.directoryInfo.parentId).forEach(document => {
            tempMap.get(document.directoryInfo.parentId || '')?.directoryInfo.children.push(document)
        })
        documents.filter(document => document.directoryInfo.parentId).forEach(document => {
            tempMap.delete(document.meta.id)
        })
        documents.forEach(document => document.directoryInfo.children.sort((a, b) => a.directoryInfo.order - b.directoryInfo.order))
        FileSystemManager.documents = Array.from(tempMap.values()).sort((a, b) => a.directoryInfo.order - b.directoryInfo.order)
    }
}
export default new DocumentManager()
