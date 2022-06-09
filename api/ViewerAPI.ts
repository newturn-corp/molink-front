import { BaseAPI } from './baseAPI'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../Errors/DocumentError'
import { UserNotExists } from '../Errors/UserError'
import {
    GetHierarcyResponseDTO,
    GetContentResponseDTO,
    GetDocumentAuthorityDTO,
    GetUserIDDTO,
    GetUserInfoByUserMapResponseDTO,
    GetPageListResponseDTO,
    GetFollowInfoResponseDTO,
    GetFollowStatusResponseDTO,
    ESPageSummary, GetUserLikePageResponseDTO, ESComment, GetPageListDTO, ESPageMetaInfo
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

    async getContent (documentId: string): Promise<any> {
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

    async getUserPageList (userId: number, dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/page-list/${userId}?from=${dto.from}&count=${dto.count}`)
        return res.data
    }

    async getFollowPageList (dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/page-list/follow?from=${dto.from}&count=${dto.count}`)
        return res.data
    }

    async getPopularPageList (dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/page-list/popular?from=${dto.from}&count=${dto.count}`)
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

    async getUserFollowInfo (userID: number): Promise<GetFollowInfoResponseDTO> {
        const res = await this.get(`/viewer/users/${userID}/follow-info`)
        return res.data
    }

    async getUserFollowStatus (userID: number): Promise<GetFollowStatusResponseDTO> {
        const res = await this.get(`/viewer/users/${userID}/follow-status`)
        return res.data
    }

    async getPageSummary (pageID: string): Promise<ESPageSummary> {
        const res = await this.get(`/viewer/pages/${pageID}/summary`)
        return res.data
    }

    async getPageMetaInfo (pageID: string): Promise<ESPageMetaInfo> {
        const res = await this.get(`/viewer/pages/${pageID}/meta-info`)
        return res.data
    }

    async getUserLikePage (pageID: string): Promise<GetUserLikePageResponseDTO> {
        const res = await this.get(`/viewer/pages/${pageID}/like`)
        return res.data
    }

    async getPageComments (pageID: string): Promise<ESComment[]> {
        const res = await this.get(`/viewer/pages/${pageID}/comments`)
        return res.arr
    }
}
export default new ViewerAPI()
