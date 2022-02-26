import { BaseAPI } from './baseAPI'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../Errors/DocumentError'
import { UserNotExists } from '../Errors/UserError'
import {
    GetHierarcyResponseDTO,
    GetContentResponseDTO,
    GetDocumentAuthorityDTO,
    GetUserIDDTO
} from '@newturn-develop/types-molink'
import { ContentNotExists, ContentUserNotExists } from '../Errors/ContentError'

class ViewerAPI extends BaseAPI {
    async getUserIDByNickname (nickname: string) {
        const res = await this.get(`/viewer/users/${nickname}/id`)
        if (res.status === 404001) {
            throw new UserNotExists()
        }
        return res.data as GetUserIDDTO
    }

    async getDocumentAuthority (documentId: string) {
        const res = await this.get(`/viewer/documents/${documentId}/authority`)
        if (res.status === 404001) {
            throw new DocumentNotExists()
        } else if (res.status === 404002) {
            throw new UserNotExists()
        } else if (res.status === 404003) {
            throw new UserNotExists()
        } else if (res.status === 400001) {
            throw new UnexpectedError()
        }
        return res.data as GetDocumentAuthorityDTO
    }

    async getDocumentsHierarchy (userId: number): Promise<GetHierarcyResponseDTO> {
        const res = await this.get(`/viewer/hierarchy/${userId}`)
        if (res.status === 404001) {
            throw new UserNotExists()
        } else if (res.status === 400001) {
            throw new UnexpectedError()
        }
        return res.data
    }

    async getContent (documentId: string): Promise<GetContentResponseDTO> {
        const res = await this.get(`/viewer/contents/${documentId}`)
        if (res.status === 404001) {
            throw new ContentNotExists()
        } else if (res.status === 404002) {
            throw new ContentUserNotExists()
        } else if (res.status === 409001) {
            throw new UnauthorizedForDocument()
        }
        return res.data
    }
}
export default new ViewerAPI()
