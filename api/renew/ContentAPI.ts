import { BaseAPI } from '../baseAPI'
import { APIError } from '../APIError'
import Document from '../../domain/Document'
import { UpdateContentDTO } from '../../DTO/ContentDTO'

class ContentAPI extends BaseAPI {
    async updateContent (dto: UpdateContentDTO): Promise<any> {
        const res = await this.put('/contents', dto)
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new ContentAPI()
