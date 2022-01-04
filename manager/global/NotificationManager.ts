import { Notification } from '../../domain/Notification'

import NotificationAPI from '../../api/NotificationAPI'
import { makeAutoObservable, toJS } from 'mobx'

class NotificationManager {
    _notifications: Notification[] = []
    get viewedNotificationLength () {
        return this._notifications.filter(noti => !noti.isViewed).length
    }

    get notifications () {
        return toJS(this._notifications)
    }

    constructor () {
        makeAutoObservable(this)
        NotificationAPI.getNotifications().then(arr => {
            this._notifications = arr
        })
    }

    async checkNotificationsViewed () {
        await NotificationAPI.setNotificationsViewedAt()
        this._notifications.forEach(noti => {
            noti.isViewed = true
        })
    }

    async setNotificationsCheckedAt () {
        await NotificationAPI.setNotificationsCheckedAt()
        this._notifications = []
    }
}
export default new NotificationManager()
