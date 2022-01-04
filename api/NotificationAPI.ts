import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

import { Notification } from '../domain/Notification'

class NotificationAPI extends BaseAPI {
    async getNotifications (): Promise<Notification[]> {
        const res = await this.get('/notifications')
        if (res.status !== 200) throw new APIError(res)
        return res.arr.map(raw => new Notification(raw.id, raw.imgUrl, raw.msg, raw.isViewed, raw.createdAt))
    }

    async setNotificationsViewedAt (): Promise<void> {
        const res = await this.put('/notifications/viewed-at', {})
        if (res.status !== 200) throw new APIError(res)
    }

    async setNotificationsCheckedAt (): Promise<void> {
        const res = await this.put('/notifications/checked-at', {})
        if (res.status !== 200) throw new APIError(res)
    }
}
export default new NotificationAPI()
