import { BaseAPI } from '../baseAPI'
import { APIError } from '../APIError'
import { SetBlogBiographyDTO, SetBlogProfileImageDTO } from '@newturn-develop/types-molink'

class BlogProfileAPI extends BaseAPI {
    async setBlogBiography (dto: SetBlogBiographyDTO): Promise<void> {
        const res = await this.put('/hierarchy/profile/biography', dto)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }

    async setBlogProfileImage (dto: SetBlogProfileImageDTO): Promise<void> {
        console.log('setBlogProfileImage')
        const res = await this.putFormData('/hierarchy/profile/profile-image', dto)
        if (res.status !== 200) throw new APIError(res)
        return res.data
    }
}
export default new BlogProfileAPI()
