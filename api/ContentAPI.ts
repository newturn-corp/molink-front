import { BaseAPI } from './baseAPI'
import { CreateDocumentDTO, UpdatePageDataInSearchEngineDTO } from '@newturn-develop/types-molink/dist/DTO'
import { DeleteContentsDTO } from '@newturn-develop/types-molink/DTO/ContentDTO'

class ContentAPI extends BaseAPI {
    async createContent (pageId: string) {
        await this.post('/contents/contents', new CreateDocumentDTO(pageId))
    }

    async deleteContents (dto: DeleteContentsDTO) {
        await this.delete('/contents/contents', dto)
    }

    async updatePageDataInSearchEngine (dto: UpdatePageDataInSearchEngineDTO) {
        await this.put('/contents/page-data', dto)
    }
}
export default new ContentAPI()
