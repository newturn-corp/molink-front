import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'
import { GetUserProfileDTO, SearchUserDTO, SearchResponseDTO, GetUserRepresentativeDocumentResponseDTO, GetUserRepresentativeDocumentURLDTO } from '../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../Errors/UserError'

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
}
export default new UserAPI()
