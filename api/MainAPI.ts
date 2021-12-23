import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { SaveSupportDTO } from '../DTO/UserDTO'

class MainAPI extends BaseAPI {
    async saveSupport (dto: SaveSupportDTO): Promise<void> {
        const res = await this.post('/supports', dto)
        if (res.status !== 201) throw new APIError(res)
    }
}
export default new MainAPI()
