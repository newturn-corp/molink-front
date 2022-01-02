import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'
import { GetUserProfileDTO, SearchUserDTO, SearchResponseDTO, GetUserRepresentativeDocumentResponseDTO, GetUserRepresentativeDocumentURLDTO, UpdateUserProfileImageDto, UpdateUserBiographyDTO, FollowResponseDTO, FollowRequestDTO } from '../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../Errors/UserError'
import UserSetting from '../domain/UserSetting'

class UserAPI extends BaseAPI {
    async getUserProfile (): Promise<GetUserProfileDTO> {
        const res = await this.get('/users/profile')
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async searchUsers (dto: SearchUserDTO): Promise<SearchResponseDTO> {
        const res = await this.get(`/users/search?q=${dto.searchText}`)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async getUserRepresentativeDocumentUrl (dto: GetUserRepresentativeDocumentURLDTO): Promise<GetUserRepresentativeDocumentResponseDTO> {
        const res = await this.get(`/users/representative-document-url?id=${dto.id}`)
        if (res.status === 404001) {
            throw new UserNotExists()
        } else if (res.status === 409001) {
            throw new RepresentativeDocumentNotExists()
        }
        return new GetUserRepresentativeDocumentResponseDTO(res.data.url)
    }

    async updateUserProfileImage (dto: UpdateUserProfileImageDto): Promise<void> {
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
}
export default new UserAPI()
