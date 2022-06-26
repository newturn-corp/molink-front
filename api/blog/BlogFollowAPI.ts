import { BaseAPI } from '../baseAPI'
import { APIError } from '../APIError'
import { FollowRequestDTO, FollowResponseDTO } from '../../DTO/UserDTO'

class BlogFollowAPI extends BaseAPI {
    async follow (dto: FollowRequestDTO): Promise<FollowResponseDTO> {
        const res = await this.post('/hierarchy/follow', dto)
        if (res.status !== 201) throw new APIError(res)
        return res.data
    }
}
export default new BlogFollowAPI()
