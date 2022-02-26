import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { CollectDocumentDTO, DeleteDocumentDTO, DocumentInitialInfoDTO, GetDocumentViewInfoResponseDTO, SearchDocumentLinkResultDTO, SetDocumentIconDTO, SetDocumentIsChildrenOpenDTO, SetDocumentLocationDTO, SetDocumentTitleDTO, SetDocumentVisibilityDTO, UpdateDocumentIsLockedDTO, UpdateDocumentRepresentativeDTO, UpdateDocumentSelectionDTO } from '../DTO/DocumentDto'
import { DocumentNotExists } from '../Errors/DocumentError'
import { GetDocumentInitialInfoListDTO } from '../DTO/UserDTO'
import { CreateDocumentDTO } from '@newturn-develop/types-molink/dist/DTO'

class DocumentAPI extends BaseAPI {
    async deleteDocument (dto: DeleteDocumentDTO): Promise<void> {
        const res = await this.delete('/documents', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentVisibility (dto: SetDocumentVisibilityDTO): Promise<void> {
        const res = await this.put('/documents/visibility', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentTitle (dto: SetDocumentTitleDTO): Promise<void> {
        const res = await this.put('/documents/title', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentIsChildrenOpen (dto: SetDocumentIsChildrenOpenDTO): Promise<void> {
        const res = await this.put('/documents/is-children-open', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentIcon (dto: SetDocumentIconDTO): Promise<void> {
        const res = await this.put('/documents/icon', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentRepresentative (dto: UpdateDocumentRepresentativeDTO): Promise<void> {
        const res = await this.put('/documents/representative', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async searchDocumentsLinkList (query: string): Promise<SearchDocumentLinkResultDTO[]> {
        const res = await this.get(`/documents/search/link?q=${query}`)
        return res.arr.map(raw => new SearchDocumentLinkResultDTO(raw.id, raw.title, raw.icon, raw.userId))
    }

    async collectDocument (dto: CollectDocumentDTO): Promise<void> {
        const res = await this.post('/documents/collect', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async updateDocumentSelection (dto: UpdateDocumentSelectionDTO): Promise<void> {
        const res = await this.put('/documents/selection', dto)
        if (res.status !== 200) throw new APIError(res)
    }

    async updateDocumentIsLocked (dto: UpdateDocumentIsLockedDTO): Promise<void> {
        const res = await this.put('/documents/is-locked', dto)
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new DocumentAPI()
