import { BaseAPI } from './baseAPI'
import { UnauthorizedForDocument, UnexpectedError } from '../Errors/DocumentError'
import { UserNotExists } from '../Errors/UserError'
import { GetHierarcyResponseDTO, GetContentResponseDTO } from '@newturn-develop/types-molink'
import { ContentNotExists, ContentUserNotExists } from '../Errors/ContentError'

class ViewerAPI extends BaseAPI {
    async getDocumentsHierarchy (nickname: string): Promise<GetHierarcyResponseDTO> {
        const res = await this.get(`/viewer/hierarchy/${nickname}`)
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
