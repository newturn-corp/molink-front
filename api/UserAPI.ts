import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'
import { SearchUserDTO, SearchResponseDTO, GetUserRepresentativeDocumentResponseDTO, GetUserRepresentativeDocumentURLDTO, UpdateUserProfileImageDto, UpdateUserBiographyDTO, FollowResponseDTO, FollowRequestDTO } from '../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../Errors/UserError'
import { ESUser, GetUserIDDTO } from '@newturn-develop/types-molink'
import { Unauthorized } from '../Errors/Common'

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

    async updateUserProfileImage (dto: UpdateUserProfileImageDto): Promise<void> {
        const res = await this.putFormData('/main/users/profile-image', dto)
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
