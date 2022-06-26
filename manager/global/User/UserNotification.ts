import { makeAutoObservable, toJS } from 'mobx'
import { ESUser, NotificationInfo, NotificationType } from '@newturn-develop/types-molink'
import UserAPI from '../../../api/UserAPI'
import { Notification } from '../../../domain/Notification'
import { Page } from '../RoutingManager'
import UserInfoMap from './UserInfoMap'

export class UserNotification {
    _notifications: Notification[] = null

    get notifications (): Notification[] {
        return toJS(this._notifications)
    }

    get isNewNotificationExist () {
        return this.notifications.filter(noti => !noti.isViewed).length > 0
    }

    constructor () {
        makeAutoObservable(this)
    }

    getNotificationMessage (causeUser: ESUser, notificationInfo: NotificationInfo) {
        if (notificationInfo.notificationContent) {
            return notificationInfo.notificationContent
        }
        switch (notificationInfo.notificationType) {
        case NotificationType.NewFollow:
            return `새로운 팔로워: ${causeUser.nickname}님`
        case NotificationType.FollowAccept:
            return `${causeUser.nickname}님이 팔로우 요청을 수락하셨습니다.`
        default:
            throw new Error('Unhandled Notification Type')
        }
    }

    getNotificationLinkInfo (notificationInfo: NotificationInfo, userInfo: ESUser) {
        switch (notificationInfo.notificationType) {
        case NotificationType.Default:
        case NotificationType.FollowRequest:
        case NotificationType.NewFollow:
            // TODO: 여기 수정
        case NotificationType.FollowAccept:
            return { page: Page.Blog, extra: `/${userInfo.nickname}` }
        case NotificationType.NewComment:
        case NotificationType.NewLike:
            return { page: Page.Blog, extra: `/blog-name/${notificationInfo.additionalInfo}/page-name` }
        }
    }

    async load () {
        const infoList = await UserAPI.getNotifications()
        const userIDList = Array.from(new Set(infoList.map(info => info.causedUserId)))
        const infoMap = await UserInfoMap.getUserInfoMapByUserIDList(userIDList)
        const notifications = []
        for (const info of infoList) {
            const userInfo = infoMap[info.causedUserId]
            const {
                page, extra
            } = this.getNotificationLinkInfo(info, userInfo)
            notifications.push(new Notification('1', userInfo.profileImageUrl, this.getNotificationMessage(userInfo, info), info.isViewed, new Date(info.createdAt), page, extra))
        }
        this._notifications = notifications
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
