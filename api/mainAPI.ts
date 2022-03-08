import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { SaveSupportDTO } from '../DTO/UserDTO'
import { UploadImageDTO, UploadImageFromURLDTO, UploadImageResponseDTO } from '@newturn-develop/types-molink'

class MainAPI extends BaseAPI {
    async saveSupport (dto: SaveSupportDTO): Promise<void> {
        const res = await this.post('/main/supports', dto)
        if (res.status !== 201) throw new APIError(res)
    }

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
}
export default new MainAPI()
