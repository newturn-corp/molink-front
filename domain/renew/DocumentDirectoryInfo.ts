import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../../api/renew/DocumentAPI'
import { DocumentInitialInfoDTO, SetDocumentLocationDTO } from '../../DTO/DocumentDto'
import FileSystemManager from '../../manager/renew/FileSystemManager'
import Document from './Document'
import DocumentMeta from './DocumentMeta'

export enum DocumentVisibility {
    Public = 'public',
    Private = 'private',
    OnlyFriend = 'only_friend'
}

export default class DocumentDirectoryInfo {
    document: Document
    meta: DocumentMeta
    parentId: string
    order: number
    children: Document[] = []
    parent: Document | null
    isChildrenOpen: boolean = false

    isOpen: boolean = false
    isChangingName: boolean = false
    isNewDocument: boolean = false
    isSelected: boolean = false

    tryingGetOlderSibling: boolean = false
    tryingGetYoungerSibling: boolean = false

    constructor (document: Document, meta: DocumentMeta, dto: DocumentInitialInfoDTO) {
        this.document = document
        this.meta = meta
        this.parentId = dto.parentId
        this.order = dto.order
        this.isChildrenOpen = dto.isChildrenOpen
        makeAutoObservable(this, { document: false })
    }

    delete () {
        const sibling = this.parent ? this.parent.directoryInfo.children : FileSystemManager.documents
        sibling.splice(this.order, 1)
        sibling.forEach((doc, idx) => {
            doc.directoryInfo.order = idx
        })
    }

    async setDocumentLocation (parent: Document | null, order: number): Promise<void> {
        // 기존 부모에게서 삭제
        if (this.parent === null) {
            FileSystemManager.documents.splice(this.order, 1)
            FileSystemManager.documents.filter(info => info.directoryInfo.order > this.order).forEach(info => { info.directoryInfo.order -= 1 })
        } else {
            this.parent.directoryInfo.children.splice(this.order, 1)
            this.parent.directoryInfo.children.filter(doc => doc.directoryInfo.order > this.order).forEach(info => { info.directoryInfo.order -= 1 })
        }

        const [parentIdBefore, orderBefore] = [this.parent ? this.parent.meta.id : null, this.order]
        const parentId = parent ? parent.meta.id : null
        await DocumentAPI.setDocumentLocation(new SetDocumentLocationDTO(this.meta.id, parentIdBefore, parentId, orderBefore, order))
        this.parent = parent
        this.order = order
        this.parentId = parentId

        // 새 부모에게 추가
        if (this.parent === null) {
            FileSystemManager.documents.splice(this.order, 0, this.document)
            FileSystemManager.documents.filter(info => info.directoryInfo.order > orderBefore).forEach(info => { info.directoryInfo.order -= 1 })
        } else {
            this.parent.directoryInfo.children.splice(this.order, 0, this.document)
            this.parent.directoryInfo.children.filter(info => info.directoryInfo.order >= orderBefore).forEach(info => { info.directoryInfo.order += 1 })
        }
    }
}
