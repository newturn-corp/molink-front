import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'
import UserSetting from '../domain/UserSetting'

class SettingAPI extends BaseAPI {
    async getUserSetting (): Promise<UserSetting> {
        const res = await this.get('/main/settings')
        if (res.status !== 200) throw new APIError(res)
        const { data } = res
        return new UserSetting(data.followWithoutApprove, data.showSubDocumentCount, data.fileSystemWidth)
    }

    async setFollowWithoutApprove (value: boolean): Promise<void> {
        const res = await this.put('/main/settings/follow-without-approve', { value })
        if (res.status !== 200) throw new APIError(res)
    }

    async setShowSubDocumentCount (value: boolean): Promise<void> {
        const res = await this.put('/main/settings/show-sub-document-count', { value })
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new SettingAPI()
