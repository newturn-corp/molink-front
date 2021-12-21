import { BaseAPI } from '../baseAPI'
import { APIError } from '../APIError'

import { CreateDocumentDTO, DeleteDocumentDTO, DocumentInitialInfoDTO, GetDocumentDto, SetDocumentIsChildrenOpenDTO, SetDocumentLocationDTO, SetDocumentTitleDTO, SetDocumentVisibilityDTO } from '../../DTO/DocumentDto'
import { DocumentNotExists } from '../../Errors/DocumentError'

class DocumentAPI extends BaseAPI {
    async createDocument (dto: CreateDocumentDTO): Promise<string> {
        const res = await this.post('/documents', dto)
        if (res.status !== 201) throw new APIError(res)
        return res.data.id
    }

    async setDocumentLocation (dto: SetDocumentLocationDTO): Promise<void> {
        const res = await this.put('/documents/location', dto)
        if (res.status !== 200) throw new APIError(res)
    }

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

    async getDocumentInitialInfoList (): Promise<DocumentInitialInfoDTO[]> {
        const res = await this.get('/documents/initial-info-list')
        if (res.status !== 200) throw new APIError(res)
        return res.arr.map(raw => new DocumentInitialInfoDTO(raw.id, raw.userId, raw.title, raw.icon, raw.parentId, raw.order, raw.isChildrenOpen))
    }

    async getDocument (documentId: string): Promise<GetDocumentDto> {
        const res = await this.get(`/documents/${documentId}`)
        if (res.status === 404001) {
            throw new DocumentNotExists()
        }
        const { data } = res
        return new GetDocumentDto(data.id, data.userId, data.title, data.icon, data.visibility, data.createdAt, data.updatedAt, data.authority, data.content, data.contentId)
    }

    async setDocumentIsChildrenOpen (dto: SetDocumentIsChildrenOpenDTO): Promise<void> {
        const res = await this.put('/documents/is-children-open', dto)
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new DocumentAPI()
