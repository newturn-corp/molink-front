import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import Document from '../domain/Document'

class MainAPI extends BaseAPI {
    async getDocuments (): Promise<Document[]> {
        try {
            const res = await this.get('/main/documents')
            return []
        } catch (err) {

        }

    }
}
export default new MainAPI()
