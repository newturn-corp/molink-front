import { makeAutoObservable, toJS } from 'mobx'
import { BlogNotificationType } from '@newturn-develop/types-molink'
import UserAPI from '../../../api/UserAPI'
import { Notification } from '../../../domain/Notification'
import { Page } from '../RoutingManager'
import BlogNotificationAPI from '../../../api/blog/BlogNotificationAPI'
import { BlogNotification } from '../../../domain/BlogNotification'
import UserInfoMap from '../User/UserInfoMap'
import GlobalManager from '../GlobalManager'
import { BlogNotificationView } from './Notification/BlogNotificationView'

export class BlogNotifications {
    _notifications: Notification[] = null
    view: BlogNotificationView

    get notifications (): Notification[] {
        return toJS(this._notifications)
    }

    get isNewNotificationExist () {
        return this.notifications.filter(noti => !noti.isViewed).length > 0
    }

    constructor () {
        makeAutoObservable(this)
    }

    async load (blogID: number) {
        const infoList = await BlogNotificationAPI.getActiveNotifications(blogID)
        const newUserIDList = []
        const notifications = []
        for (const info of infoList) {
            const { notificationType, additionalInfo } = info
            switch (notificationType) {
            case BlogNotificationType.NewLike:
            case BlogNotificationType.NewComment:
                const userID = Number(additionalInfo.split(',')[1])
                newUserIDList.push(userID)
            }
        }
        await UserInfoMap.updateUserInfoMapByUserIDList(newUserIDList)
        for (const info of infoList) {
            const { notificationType, additionalInfo, notificationContent, isViewed, createdAt } = info
            switch (notificationType) {
            case BlogNotificationType.NewLike:
            case BlogNotificationType.NewComment:
                const [pageID, userIDString] = additionalInfo.split(',')
                const userID = Number(userIDString)
                notifications.push(new BlogNotification(UserInfoMap.idMap[userID].profileImageUrl, notificationContent, isViewed, Page.Blog, `/blog-name/${pageID}/page-title`, createdAt))
            }
        }
        this._notifications = notifications
        this.view = new BlogNotificationView()
    }

    reset () {
        this._notifications = []
    }

    async checkNotificationsViewed () {
        await UserAPI.setNotificationsViewedAt()
        this._notifications.forEach(noti => {
            noti.isViewed = true
        })
    }

    async setNotificationsCheckedAt () {
        await UserAPI.setNotificationsCheckedAt()
        this._notifications = []
    }
}
