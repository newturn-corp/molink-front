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
        makeAutoObservable(this, { document: false, parent: false })
    }

    delete () {
        // const sibling = this.parent ? this.parent.directoryInfo.children : FileSystemManager.documents
        // sibling.splice(this.order, 1)
        // sibling.forEach((doc, idx) => {
        //     doc.directoryInfo.order = idx
        // })
    }

    getSibling () {
        // return this.parent ? this.parent.directoryInfo.children : FileSystemManager.documents
    }

    async setDocumentLocation (parent: Document | null, order: number): Promise<void> {
        // // 만약 새로 추가된 부모가 이 문서보다 공개범위가 좁은 경우
        // if (parent && parent.meta.visibility < this.meta.visibility) {
        //     const index = await DialogManager.openDialog('공개 범위 주의', `새로운 상위 문서의 공개 범위가 현재 공개 범위인 '${Document.visibilityToText(this.meta.visibility)}'보다 좁습니다.`, ['상위 문서의 공개 범위 넓히기', '이 문서와 하위 문서의 공개 범위 좁히기'])
        //     if (index === -1) {
        //         return
        //     }
        //     if (index === 0) {
        //         await parent.changeDocumentVisibility(this.meta.visibility, true)
        //     }
        //     if (index === 1) {
        //         await this.document.changeDocumentVisibility(parent.meta.visibility, true)
        //     }
        // }
        // // 기존 부모에게서 삭제
        // if (this.parent === null) {
        //     FileSystemManager.documents.filter(info => info.directoryInfo.order > this.order).forEach(info => { info.directoryInfo.order -= 1 })
        //     FileSystemManager.documents.splice(this.order, 1)
        // } else {
        //     this.parent.directoryInfo.children.filter(doc => doc.directoryInfo.order > this.order).forEach(info => { info.directoryInfo.order -= 1 })
        //     this.parent.directoryInfo.children.splice(this.order, 1)
        // }

        // const [parentIdBefore, orderBefore] = [this.parent ? this.parent.meta.id : null, this.order]
        // const parentId = parent ? parent.meta.id : null
        // this.parent = parent
        // this.order = order
        // this.parentId = parentId

        // // 새 부모에게 추가
        // if (this.parent === null) {
        //     FileSystemManager.documents.filter(info => info.directoryInfo.order >= this.order).forEach(info => { info.directoryInfo.order += 1 })
        //     FileSystemManager.documents.splice(this.order, 0, this.document)
        // } else {
        //     this.parent.directoryInfo.children.filter(info => info.directoryInfo.order >= this.order).forEach(info => { info.directoryInfo.order += 1 })
        //     this.parent.directoryInfo.children.splice(this.order, 0, this.document)
        //     if (this.isOpen) {
        //         this.parent.directoryInfo.isChildrenOpen = true
        //     }
        // }
        // await DocumentAPI.setDocumentLocation(new SetDocumentLocationDTO(this.meta.id, parentIdBefore, parentId, orderBefore, order))
    }
}
