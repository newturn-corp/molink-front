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
    async getFileSecurity (): Promise<GetFileSecurityDTO> {
        const res = await this.get('/files/security')
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
