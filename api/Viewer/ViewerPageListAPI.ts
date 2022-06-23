import { BaseAPI } from '../baseAPI'
import { GetPageListDTO, GetPageListResponseDTO } from '@newturn-develop/types-molink'

class ViewerAPI extends BaseAPI {
    async getUserPageList (userId: number, dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/page-list/users/${userId}?from=${dto.from}&count=${dto.count}`)
        return res.data
    }

    async getFollowPageList (dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/page-list/follow?from=${dto.from}&count=${dto.count}`)
        return res.data
    }

    async getPopularPageList (dto: GetPageListDTO): Promise<GetPageListResponseDTO> {
        const res = await this.get(`/viewer/page-list/popular?from=${dto.from}&count=${dto.count}`)
        return res.data
    }
}
export default new ViewerAPI()
