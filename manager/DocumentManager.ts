import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/renew/DocumentAPI'
import Document from '../domain/Document'
import { GetDocumentInitialInfoListDTO } from '../DTO/UserDTO'
import EventManager, { Event } from './EventManager'
import FileSystemManager from './FileSystemManager'

// 특정 Document의 대한 변화를 추적해서 서버로 반영하는 역할
class DocumentManager {
    documentMap: Map<string, Document> = new Map<string, Document>()

    constructor () {
        makeAutoObservable(this)
    }

    async init (userId: number) {
        const initialInfoDTOList = await DocumentAPI.getDocumentInitialInfoList(new GetDocumentInitialInfoListDTO(userId))
        const documents = initialInfoDTOList.map(infoDTO => new Document(infoDTO))

        const tempMap = new Map<string, Document>()
        documents.forEach(document => {
            tempMap.set(document.meta.id, document)
            this.documentMap.set(document.meta.id, document)
        })
        documents.filter(document => document.directoryInfo.parentId).forEach(document => {
            const parent = tempMap.get(document.directoryInfo.parentId || '')
            if (parent) {
                parent.directoryInfo.children.push(document)
                document.directoryInfo.parent = parent
            }
        })
        documents.filter(document => document.directoryInfo.parentId).forEach(document => {
            tempMap.delete(document.meta.id)
        })
        documents.forEach(document => document.directoryInfo.children.sort((a, b) => a.directoryInfo.order - b.directoryInfo.order))
        FileSystemManager.documents = Array.from(tempMap.values()).sort((a, b) => a.directoryInfo.order - b.directoryInfo.order)
        EventManager.issueEvent(Event.DocumentMapInited, {})
    }
}
export default new DocumentManager()
