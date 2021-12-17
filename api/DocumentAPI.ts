import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'

class DocumentAPI extends BaseAPI {
    async getDocuments (): Promise<Document[]> {
        const res = await this.get('/documents')
        if (res.status !== 200) throw new APIError(res)
        return res.arr.map(raw => new Document(raw.id, null, raw.title, raw.icon, raw.order, raw.children, raw.isOpen))
    }

    async createDocument (document: Document): Promise<string> {
        const res = await this.post('/documents', {
            title: document.title,
            order: document.order,
            icon: document.icon,
            parentId: document.parent ? document.parent.id : null
        })
        if (res.status !== 201) throw new APIError(res)
        return res.data.id
    }

    async setDocumentTitle (document: Document): Promise<void> {
        const res = await this.put('/documents/title', {
            id: document.id,
            title: document.title
        })
        if (res.status !== 200) throw new APIError(res)
    }

    async deleteDocument (document: Document): Promise<void> {
        const res = await this.delete('/documents', {
            id: document.id,
            parentId: document.parent ? document.parent.id : null,
            order: document.order
        })
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentLocation (parentBefore: Document | null, orderBefore: number, document: Document): Promise<void> {
        const res = await this.put('/documents/location', {
            id: document.id,
            parentIdBefore: parentBefore ? parentBefore.id : parentBefore,
            parentId: document.parent ? document.parent.id : null,
            orderBefore: orderBefore,
            order: document.order
        })
        if (res.status !== 200) throw new APIError(res)
    }

    async setDocumentIsOpen (document: Document): Promise<void> {
        const res = await this.put('/documents/is-open', {
            id: document.id,
            isOpen: document.isOpen
        })
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new DocumentAPI()
