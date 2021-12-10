import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'

class MainAPI extends BaseAPI {
    async getDocuments (): Promise<Document[]> {
        const res = await this.get('/main/documents')
        if (res.status !== 200) throw new APIError(res)
        return res.arr.map(raw => new Document(raw.title, raw.order, raw.children))
    }
}
export default new MainAPI()
