import DocumentAPI from '../../api/DocumentAPI'
import Document from '../../domain/Document/Document'
import DocumentAuthority from '../../domain/DocumentAuthority'
import { UnauthorizedForDocument } from '../../Errors/DocumentError'
import DocumentHierarchyManager from './DocumentHierarchyManager/DocumentHierarchyManager'

class DocumentManager {
    openedDocumentId: string
    isLoadingContent: boolean = false
    openedDocument: Document = null
    authority: DocumentAuthority

    async loadDocument (documentId: string) {
        // if (this.isLoadingContent) {
        //     return
        // }
        // this.isLoadingContent = true
        // const viewInfo = await DocumentAPI.getDocumentViewInfo(documentId)
        // this.authority = viewInfo.authority
        // if (!this.authority.viewable) {
        //     this.isLoadingContent = false
        //     throw new UnauthorizedForDocument()
        // }
        // const document = DocumentHierarchyManager.hierarchy.getDocumentById(documentId)
        // if (!document) {
        //     throw new UnauthorizedForDocument()
        // }
        // document.setDocumentViewInfo(viewInfo.visibility, viewInfo.content)
        // this.openedDocument = document
    }

    checkIsDocumentOpen (documentId: string) {
        return this.openedDocumentId === documentId
    }
}
export default new DocumentManager()
