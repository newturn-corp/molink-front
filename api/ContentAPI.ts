import { BaseAPI } from './baseAPI'
import { CreateDocumentDTO, UpdatePageDataInSearchEngineDTO, LikeDTO, CancelLikeDTO, SaveCommentDTO, SaveCommentResponseDTO } from '@newturn-develop/types-molink/dist/DTO'
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

    async likePage (pageId: string) {
        await this.post('/contents/like', new LikeDTO(pageId))
    }

    async cancelLikePage (pageId: string) {
        await this.put('/contents/like/cancel', new CancelLikeDTO(pageId))
    }

    async saveComment (dto: SaveCommentDTO): Promise<SaveCommentResponseDTO> {
        const res = await this.post('/contents/comment', dto)
        return res.data
    }
}
export default new ContentAPI()
