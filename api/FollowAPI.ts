import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { SaveSupportDTO } from '../DTO/UserDTO'
import { FollowRequest } from '../domain/FollowRequest'
import { AcceptFollowRequestDTO, RejectFollowRequestDTO } from '../DTO/FollowDTO'

class FollowAPI extends BaseAPI {
    async getFollowRequests (): Promise<FollowRequest[]> {
        const res = await this.get('/follow/requests')
        if (res.status !== 200) throw new APIError(res)
        return res.arr.map(dto => new FollowRequest(dto.id, dto.profileImgUrl, dto.blogName, dto.isViewed, dto.createdAt))
    }

    async rejectFollowRequest (dto: RejectFollowRequestDTO): Promise<void> {
        const res = await this.put('/follow/requests/reject', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async acceptFollowRequest (dto: AcceptFollowRequestDTO): Promise<void> {
        const res = await this.put('/follow/requests/accept', dto)
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new FollowAPI()
