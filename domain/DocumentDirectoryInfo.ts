import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import { DocumentInitialInfoDTO, SetDocumentIsChildrenOpenDTO, SetDocumentLocationDTO } from '../DTO/DocumentDto'
import DialogManager from '../manager/global/DialogManager'
import FileSystemManager from '../manager/Home/Hierarchy/HierarchyManager'
import UserManager from '../manager/global/UserManager'
import Document from './Document'
import DocumentMeta from './DocumentMeta'

export default class DocumentDirectoryInfo {
    document: Document
    meta: DocumentMeta
    parentId: string
    order: number
    children: Document[] = []
    parent: Document | null = null
    isChildrenOpen: boolean = false

    isChangingName: boolean = false
    tryingGetYoungerSibling: boolean = false

    constructor (document: Document, meta: DocumentMeta, dto: DocumentInitialInfoDTO) {
        this.document = document
        this.meta = meta
        this.parentId = dto.parentId
        this.order = dto.order
        this.isChildrenOpen = dto.isChildrenOpen
        makeAutoObservable(this, { document: false, parent: false })
    }
}
