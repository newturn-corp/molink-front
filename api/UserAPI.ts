import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'
import { SearchUserDTO, GetUserRepresentativeDocumentResponseDTO, GetUserRepresentativeDocumentURLDTO, UpdateUserBiographyDTO, FollowResponseDTO, FollowRequestDTO } from '../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../Errors/UserError'
import {
    ESUser,
    GetFollowMapResponseDTO,
    GetMyFollowRequestResponseDTO,
    GetUserIDDTO,
    UpdateUserProfileImageDTO,
    GetRequestedFollowsResponseDTO, NotificationInfo, GetFollowerMapResponseDTO
} from '@newturn-develop/types-molink'
import { Unauthorized } from '../Errors/Common'
import { FollowRequest } from '../domain/FollowRequest'
import { AcceptFollowRequestDTO, RejectFollowRequestDTO } from '../DTO/FollowDTO'

class UserAPI extends BaseAPI {
    async getUserID (): Promise<number> {
        const res = await this.get('/main/users/id')
        if (res.status === 401) {
            throw new Unauthorized()
        }
        if (res.status !== 200) throw new APIError(res)
        const data = res.data as GetUserIDDTO
        return data.id
    }

    async searchUsers (dto: SearchUserDTO): Promise<ESUser[]> {
        const res = await this.get(`/main/users/search?q=${dto.searchText}`)
        if (res.status !== 200) throw new APIError(res)
        return res.arr
    }

    async getUserRepresentativeDocumentUrl (dto: GetUserRepresentativeDocumentURLDTO): Promise<GetUserRepresentativeDocumentResponseDTO> {
        const res = await this.get(`/main/users/representative-document-url?id=${dto.id}`)
        if (res.status === 404001) {
            throw new UserNotExists()
        } else if (res.status === 409001) {
            throw new RepresentativeDocumentNotExists()
        }
        return new GetUserRepresentativeDocumentResponseDTO(res.data.url)
    }

    async updateUserProfileImage (dto: UpdateUserProfileImageDTO): Promise<void> {
        const res = await this.putFormData('/users/profile-image', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async updateUserBiography (dto: UpdateUserBiographyDTO): Promise<void> {
        const res = await this.put('/users/biography', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async follow (dto: FollowRequestDTO): Promise<FollowResponseDTO> {
        const res = await this.post('/users/follow', dto)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async getFollowMap (): Promise<GetFollowMapResponseDTO> {
        const res = await this.get('/users/follow')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async getFollowerMap (): Promise<GetFollowerMapResponseDTO> {
        const res = await this.get('/users/follow/followers')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async getMyFollowRequestMap (): Promise<GetMyFollowRequestResponseDTO> {
        const res = await this.get('/users/follow/requests')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async getRequestedFollows (): Promise<GetRequestedFollowsResponseDTO> {
        const res = await this.get('/users/follow/requested-follows')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async rejectFollowRequest (dto: RejectFollowRequestDTO): Promise<void> {
        const res = await this.put('/users/follow/requests/reject', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async acceptFollowRequest (dto: AcceptFollowRequestDTO): Promise<void> {
        const res = await this.put('/users/follow/requests/accept', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async setFollowRequestsViewedAt (): Promise<void> {
        const res = await this.put('/users/follow/requests/viewed_at', {})
        if (res.status !== 200) throw new APIError(res)
    }

    async getNotifications (): Promise<NotificationInfo[]> {
        const res = await this.get('/users/notifications')
        if (res.status !== 200) throw new APIError(res)
        return res.arr
    }

    async setNotificationsViewedAt (): Promise<void> {
        const res = await this.put('/users/notifications/viewed-at', {})
        if (res.status !== 200) throw new APIError(res)
    }

    async setNotificationsCheckedAt (): Promise<void> {
        const res = await this.put('/users/notifications/checked-at', {})
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new UserAPI()
