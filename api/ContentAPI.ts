import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'
import { UpdateContentDTO, UploadContentImageDto, UploadContentImageResponseDTO } from '../DTO/ContentDTO'

class ContentAPI extends BaseAPI {
    async updateContent (dto: UpdateContentDTO): Promise<any> {
        const res = await this.put('/contents', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async uploadContentImage (dto: UploadContentImageDto): Promise<UploadContentImageResponseDTO> {
        const res = await this.postFormData('/contents/image', dto)
        if (res.status !== 201) throw new APIError(res)
        return res.data
    }
}
export default new ContentAPI()
