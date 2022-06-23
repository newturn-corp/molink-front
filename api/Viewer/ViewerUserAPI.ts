import { BaseAPI } from '../baseAPI'
import {
    ESBlog,
    GetFollowInfoResponseDTO,
    PageSearchResultDTO,
    UserSearchResultDTO
} from '@newturn-develop/types-molink'

class ViewerUserAPI extends BaseAPI {
    async getUserBlogs (userID: number): Promise<ESBlog[]> {
        const res = await this.get(`/viewer/users/${userID}/blogs`)
        return res.arr
    }

    async getUserFollowBlogs (userID: number): Promise<ESBlog[]> {
        const res = await this.get(`/viewer/users/${userID}/follow-blogs`)
        return res.arr
    }
}
export default new ViewerUserAPI()
