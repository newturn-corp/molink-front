import { BaseAPI } from '../baseAPI'
import {
    GetBlogFollowerCountDTO,
    GetBlogInfoMapByBlogIDListResponseDTO,
    GetBlogInfoMapByBlogNameListResponseDTO, GetPageListDTO, GetPageListResponseDTO
} from '@newturn-develop/types-molink'

class ViewerBlogAPI extends BaseAPI {
    async getBlogInfoMapByIDList (blogIDList: number[]): Promise<GetBlogInfoMapByBlogIDListResponseDTO> {
        const res = await this.get(`/viewer/blog/info-map-by-id?blogIDList=${blogIDList.join(',')}`)
        console.log(res)
        return res.data
    }

    async getBlogInfoMapByNameList (blogNameList: string[]): Promise<GetBlogInfoMapByBlogNameListResponseDTO> {
        const res = await this.get(`/viewer/blog/info-map-by-name?blogNameList=${blogNameList.join(',')}`)
        return res.data
    }

    async getBlogFollowerCount (blogID: number): Promise<GetBlogFollowerCountDTO> {
        const res = await this.get(`/viewer/blog/${blogID}/follower-count`)
        return res.data
    }

    async getBlogPageList (blogID: number, dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/blog/${blogID}/page-list?from=${dto.from}&count=${dto.count}`)
        return res.data
    }
}
export default new ViewerBlogAPI()
