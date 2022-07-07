import { BaseAPI } from '../baseAPI'
import { APIError } from '../APIError'
import { BlogNotificationInfo, SetBlogBiographyDTO, SetBlogProfileImageDTO } from '@newturn-develop/types-molink'

class BlogProfileAPI extends BaseAPI {
    async getActiveNotifications (blogID: number): Promise<BlogNotificationInfo[]> {
        const res = await this.get(`/hierarchy/notifications/${blogID}`)
        if (res.status !== 200) throw new APIError(res)
        return res.arr
    }
}
export default new BlogProfileAPI()
