import { BaseAPI } from './baseAPI'
import { CreateDocumentDTO } from '@newturn-develop/types-molink/dist/DTO'
import { DeleteContentsDTO } from '@newturn-develop/types-molink/DTO/ContentDTO'

class ContentAPI extends BaseAPI {
    async createContent (documentId: string) {
        await this.post('/contents/contents', new CreateDocumentDTO(documentId))
    }

    async deleteContents (dto: DeleteContentsDTO) {
        await this.post('/contents/contents', dto)
    }
}
export default new ContentAPI()
