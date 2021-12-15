import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'

class ContentAPI extends BaseAPI {
    async getContentByDocument (document: Document): Promise<any> {
        const res = await this.get(`/contents/${document.id}`)
        if (res.status !== 200) throw new APIError(res)
        return res.arr
    }

    async updateContent (document: Document, content): Promise<any> {
        const res = await this.put('/contents', {
            documentId: document.id,
            content
        })
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new ContentAPI()
