import { BaseAPI } from './baseAPI'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../Errors/DocumentError'
import { UserNotExists } from '../Errors/UserError'
import {
    GetHierarcyResponseDTO,
    GetContentResponseDTO,
    GetDocumentAuthorityDTO,
    GetUserIDDTO,
    GetUserPageListDTO,
    GetUserInfoByUserMapDTO,
    GetUserInfoByUserMapResponseDTO,
    GetUserPageListResponseDTO, GetPageListResponseDTO
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

    async getUserPageList (userId: number, from: number): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/${userId}/pages?from=${from}`)
        return res.data
    }

    async getFollowPageList (from: number, count: number): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/follow-pages?from=${from}&count=${count}`)
        return res.data
    }

    async getUserInfoMapByIDList (userIDList: number[]): Promise<GetUserInfoByUserMapResponseDTO> {
        const res = await this.get(`/viewer/users?userIDList=${userIDList.join(',')}`)
        return res.data
    }

    async getUserInfoMapByNicknameList (userNicknameList: string[]): Promise<GetUserInfoByUserMapResponseDTO> {
        const res = await this.get(`/viewer/users/nickname-list?userNicknameList=${userNicknameList.join(',')}`)
        return res.data
    }
}
export default new ViewerAPI()
