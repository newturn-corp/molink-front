import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'
import UserSetting from '../domain/UserSetting'

class SettingAPI extends BaseAPI {
    async getUserSetting (): Promise<UserSetting> {
        const res = await this.get('/settings')
        if (res.status !== 200) throw new APIError(res)
        const { data } = res
        return new UserSetting(data.followWithoutApprove, data.showSubDocumentCount)
    }

    async setFollowWithoutApprove (value: boolean): Promise<void> {
        const res = await this.put('/settings/follow-without-approve', { value })
        if (res.status !== 200) throw new APIError(res)
    }

    async setShowSubDocumentCount (value: boolean): Promise<void> {
        const res = await this.put('/settings/show-sub-document-count', { value })
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new SettingAPI()
