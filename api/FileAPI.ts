import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'
import {
    UploadImageDTO,
    UploadImageFromURLDTO,
    UploadImageResponseDTO,
    GetFileSecurityDTO,
    NoticePageVisibilityChangeDTO, ChangePageFileRelationshipDTO
} from '@newturn-develop/types-molink'

class FileAPI extends BaseAPI {
    async uploadImage (dto: UploadImageDTO): Promise<UploadImageResponseDTO> {
        const res = await this.postFormData('/main/contents/image', dto)
        if (res.status !== 201) throw new APIError(res)
        return res.data
    }

    async uploadImageFromURL (dto: UploadImageFromURLDTO): Promise<UploadImageResponseDTO> {
        const res = await this.post('/main/contents/image/url', dto)
        if (res.status !== 201) throw new APIError(res)
        return res.data
    }

    async getFileSecurity (): Promise<GetFileSecurityDTO> {
        const res = await this.get('/files/security')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async noticePageVisibilityChange (dto: NoticePageVisibilityChangeDTO) {
        const res = await this.put('/files/pages/visibility', dto)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async addPageFileRelationship (dto: ChangePageFileRelationshipDTO) {
        const res = await this.put('/files/pages/relationship/add', dto)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async removePageFileRelationship (dto: ChangePageFileRelationshipDTO) {
        const res = await this.put('/files/pages/relationship/remove', dto)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }
}
export default new FileAPI()
