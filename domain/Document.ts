import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/renew/DocumentAPI'
import { CreateDocumentDTO, DeleteDocumentDTO, DocumentInitialInfoDTO, SetDocumentVisibilityDTO } from '../DTO/DocumentDto'
import EventManager, { Event } from '../manager/EventManager'
import DocumentManager from '../manager/DocumentManager'
import FileSystemManager from '../manager/FileSystemManager'
import UserManager from '../manager/UserManager'
import { TextCategory } from '../utils/slate'
import DocumentAuthority from './DocumentAuthority'
import DocumentDirectoryInfo from './DocumentDirectoryInfo'
import DocumentMeta from './DocumentMeta'

export enum DocumentVisibility {
    Public = 'public',
    Private = 'private',
    OnlyFriend = 'only_friend'
}

export default class Document {
    meta: DocumentMeta
    directoryInfo: DocumentDirectoryInfo
    content = []
    contentId: string = ''
    authority: DocumentAuthority = new DocumentAuthority(false, false)

    constructor (dto: DocumentInitialInfoDTO) {
        makeAutoObservable(this)
        this.meta = new DocumentMeta(dto)
        this.directoryInfo = new DocumentDirectoryInfo(this, this.meta, dto)
    }

    async delete () {
        this.directoryInfo.delete()
        EventManager.issueEvent(Event.DelteDocument, { document: this })
        await DocumentAPI.deleteDocument(new DeleteDocumentDTO(this.meta.id, this.directoryInfo.parentId, this.directoryInfo.order, this.contentId))
    }

    async changeDocumentVisibility (visibility: DocumentVisibility) {
        this.meta.visibility = visibility
        await DocumentAPI.setDocumentVisibility(new SetDocumentVisibilityDTO(this.meta.id, visibility))
    }

    equal (document: Document) {
        return document.meta.id === this.meta.id
    }

    isChildOf (document: Document) {
        return document.directoryInfo.children.filter(doc => doc.equal(this)).length > 0
    }

    static async create (parent: Document | null, order: number) {
        // 문서 신규 생성시 기본 값들
        const defaultTitle = ''
        const defaultIcon = '📄'
        const defaultVisibility = DocumentVisibility.Private
        const defaultContent = [{
            type: 'title',
            children: [{ text: '' }]
        }, { type: 'text', category: TextCategory.Content3, children: [{ text: '' }] }]

        const parentId = parent ? parent.meta.id : null
        const id = await DocumentAPI.createDocument(new CreateDocumentDTO(defaultTitle, defaultIcon, parentId, order, defaultVisibility, defaultContent))
        const document = new Document(new DocumentInitialInfoDTO(id, UserManager.userId, '', defaultIcon, parentId, order, false))
        DocumentManager.documentMap.set(id, document)
        // 부모에 새로운 문서 추가
        if (parent) {
            parent.directoryInfo.children.splice(order, 0, document)
            // 부모가 있으면 자식에 부모 연결
            document.directoryInfo.parent = parent
            console.log(typeof parent.directoryInfo.setIsChildrenOpen)
            parent.directoryInfo.setIsChildrenOpen(true)
        } else {
            FileSystemManager.documents.splice(order, 0, document)
        }
        document.content = defaultContent
        return document
    }
}
