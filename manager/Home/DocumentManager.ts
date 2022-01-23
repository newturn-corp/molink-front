import HierarchyChildrenOpenServer from '../../LiveServer/HierarchyChildrenOpenServer'
import { UpdateDocumentChildrenOpenDTO } from '@newturn-develop/types-molink/dist/DTO'

class DocumentManager {
    async updateDocumentChildrenOpen (documentId: string, isOpen: boolean) {
        await HierarchyChildrenOpenServer.updateDocumentChildrenOpen(new UpdateDocumentChildrenOpenDTO(documentId, isOpen))
    }
}
export default new DocumentManager()
