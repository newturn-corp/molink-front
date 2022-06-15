import { BaseAPI } from '../baseAPI'
import { PageSearchResultDTO, UserSearchResultDTO } from '@newturn-develop/types-molink'

class ViewerSearchAPI extends BaseAPI {
    async searchPage (text: string, from: number, size: number) {
        const res = await this.get(`/viewer/search/pages?q=${text}&from=${from}&size=${size}`)
        return res.data as PageSearchResultDTO
    }

    async searchUser (text: string, from: number, size: number) {
        const res = await this.get(`/viewer/search/users?q=${text}&from=${from}&size=${size}`)
        return res.data as UserSearchResultDTO
    }
}
export default new ViewerSearchAPI()
