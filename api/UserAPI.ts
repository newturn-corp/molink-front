import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'
import { GetUserProfileDTO } from '../DTO/UserDTO'

class UserAPI extends BaseAPI {
    async getUserProfile (): Promise<GetUserProfileDTO> {
        const res = await this.get('/users/profile')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }
}
export default new UserAPI()