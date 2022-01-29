import { BaseAPI } from './baseAPI'
import Automerge from 'automerge'

import { DocumentHierarchyInfoDTO, GetDocumentViewInfoResponseDTO } from '../DTO/DocumentDto'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../Errors/DocumentError'
import { UserNotExists } from '../Errors/UserError'
import { GetHierarchyChildrenOpenDTO, GetHierarcyResponseDTO } from '@newturn-develop/types-molink'

export enum ViewerAPIFailReason {
    UserNotExists,
    UnexpectedError
}

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
}
export default new ViewerAPI()
