import { BaseAPI } from './baseAPI'
import { CreateDocumentDTO } from '@newturn-develop/types-molink/dist/DTO'

class ContentAPI extends BaseAPI {
    async createContent (documentId: string) {
        await this.post('/contents/contents', new CreateDocumentDTO(documentId))
    }
}
export default new ContentAPI()
