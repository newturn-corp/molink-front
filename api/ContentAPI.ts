import { BaseAPI } from './baseAPI'
import {
    CreateDocumentDTO,
    UpdatePageDataInSearchEngineDTO,
    LikeDTO,
    CancelLikeDTO,
    SaveCommentDTO,
    SaveCommentResponseDTO,
    PublishPageDTO, CreatePageDTO
    , HierarchyDocumentInfoInterface, CreatePageResponseDTO, UpdatePageTitleDTO, UpdatePageHeaderIconDTO
} from '@newturn-develop/types-molink'
import { DeleteContentsDTO } from '@newturn-develop/types-molink/DTO/ContentDTO'

class ContentAPI extends BaseAPI {
    async createContentV2 (dto: CreatePageDTO): Promise<CreatePageResponseDTO> {
        const res = await this.post('/contents/contents/v2', dto)
        return res.data
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

    async publishPage (dto: PublishPageDTO) {
        const res = await this.put('/contents/publish', dto)
        return res.data
    }

    async updatePageTitle (dto: UpdatePageTitleDTO) {
        await this.put('/contents/title', dto)
    }

    async updatePageHeaderIcon (dto: UpdatePageHeaderIconDTO) {
        await this.put('/contents/icon', dto)
    }
}
export default new ContentAPI()
