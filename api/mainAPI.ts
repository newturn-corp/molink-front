import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { SaveSupportDTO } from '../DTO/UserDTO'
import {
    AnalyzeLinkResponseDTO,
    UploadImageDTO,
    UploadImageFromURLDTO,
    UploadImageResponseDTO
} from '@newturn-develop/types-molink'

class MainAPI extends BaseAPI {
    async saveSupport (dto: SaveSupportDTO): Promise<void> {
        const res = await this.post('/main/supports', dto)
        if (res.status !== 201) throw new APIError(res)
    }

    async analyzeLink (link: string): Promise<AnalyzeLinkResponseDTO> {
        const res = await this.get(`/main/link/analyze?link=${encodeURIComponent(link)}`)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }
}
export default new MainAPI()
