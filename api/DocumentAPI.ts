import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { DocumentIsPrivate, DocumentNotExists, DocumentOnlyOpenedForFollower, UnauthorizedForDocument } from '../Errors/DocumentError'
import { DocumentInitialInfoDTO, GetDocumentDto } from '../DTO/DocumentDto'

// class DocumentAPI extends BaseAPI {
//     async getDocuments (): Promise<Document[]> {
//         const res = await this.get('/documents')
//         if (res.status !== 200) throw new APIError(res)
//         return res.arr.map(raw => new Document(raw.id, null, raw.title, raw.icon, raw.order, raw.children, false, raw.isChildrenOpen, false, false, raw.visibility))
//     }

//     async getDocumentInitialInfoList (): Promise<DocumentInitialInfoDTO[]> {
//         const res = await this.get('/documents/initial-info-list')
//         if (res.status !== 200) throw new APIError(res)
//         return res.arr.map(raw => new DocumentInitialInfoDTO(raw.id, raw.userId, raw.title, raw.icon, raw.parentId, raw.order, raw.isChildrenOpen))
//     }

//     async getDocument (documentId: string): Promise<GetDocumentDto> {
//         const res = await this.get(`/documents/${documentId}`)
//         if (res.status === 404001) {
//             throw new DocumentNotExists()
//         }
//         const { data } = res
//         return new GetDocumentDto(data.id, data.userId, data.title, data.icon, data.visibility, data.createdAt, data.updatedAt, data.authority, data.content)
//     }

//     async createDocument (document: Document): Promise<string> {
//         const res = await this.post('/documents', {
//             title: document.title,
//             order: document.order,
//             icon: document.icon,
//             parentId: document.parent ? document.parent.id : null,
//             visibility: document.visibility
//         })
//         if (res.status !== 201) throw new APIError(res)
//         return res.data.id
//     }

//     async setDocumentTitle (document: Document): Promise<void> {
//         const res = await this.put('/documents/title', {
//             id: document.id,
//             title: document.title
//         })
//         if (res.status !== 200) throw new APIError(res)
//     }

//     async deleteDocument (document: Document): Promise<void> {
//         const res = await this.delete('/documents', {
//             id: document.id,
//             parentId: document.parent ? document.parent.id : null,
//             order: document.order
//         })
//         if (res.status !== 200) throw new APIError(res)
//     }

//     async setDocumentLocation (parentBefore: Document | null, orderBefore: number, document: Document): Promise<void> {
//         const res = await this.put('/documents/location', {
//             id: document.id,
//             parentIdBefore: parentBefore ? parentBefore.id : parentBefore,
//             parentId: document.parent ? document.parent.id : null,
//             orderBefore: orderBefore,
//             order: document.order
//         })
//         if (res.status !== 200) throw new APIError(res)
//     }

//     async setDocumentIsChildrenOpen (document: Document): Promise<void> {
//         const res = await this.put('/documents/is-children-open', {
//             id: document.id,
//             isChildrenOpen: document.isChildrenOpen
//         })
//         if (res.status !== 200) throw new APIError(res)
//     }

//     async setDocumentIcon (document: Document): Promise<void> {
//         const res = await this.put('/documents/icon', {
//             id: document.id,
//             icon: document.icon
//         })
//         if (res.status !== 200) throw new APIError(res)
//     }

//     async setDocumentVisibility (document: Document): Promise<void> {
//         const res = await this.put('/documents/visibility', {
//             id: document.id,
//             visibility: document.visibility
//         })
//         if (res.status !== 200) throw new APIError(res)
//     }
// }
// export default new DocumentAPI()
