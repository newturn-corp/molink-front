import { BaseAPI } from './baseAPI'
import Automerge from 'automerge'

import { DocumentHierarchyInfoDTO, GetDocumentViewInfoResponseDTO } from '../DTO/DocumentDto'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../Errors/DocumentError'
import { UserNotExists } from '../Errors/UserError'
import { GetHierarchyChildrenOpenDTO } from '@newturn-develop/types-molink'

export enum ViewerAPIFailReason {
    UserNotExists,
    UnexpectedError
}

class ViewerAPI extends BaseAPI {
    async getDocumentViewInfo (documentId: string): Promise<GetDocumentViewInfoResponseDTO> {
        const res = await this.get(`/viewer/documents/${documentId}`)
        if (res.status === 404001) {
            throw new DocumentNotExists()
        }
        return res.data
    }

    async getDocumentsHierarchy (nickname: string): Promise<Automerge.BinaryDocument> {
        const res = await this.get(`/viewer/hierarchy/${nickname}`)
        if (res.status === 404001) {
            throw new UserNotExists()
        } else if (res.status === 400001) {
            throw new UnexpectedError()
        }
        return res.data.serializedHierarchy
    }

    async getDocumentHierarchyChildrenOpenMap (nickname: string): Promise<GetHierarchyChildrenOpenDTO> {
        const res = await this.get(`/viewer/hierarchy/children-open-map/${nickname}`)
        if (res.status === 404001) {
            throw new UserNotExists()
        } else if (res.status === 400001) {
            throw new UnexpectedError()
        }
        return new GetHierarchyChildrenOpenDTO(res.data.serializedValue)
    }
}
export default new ViewerAPI()
