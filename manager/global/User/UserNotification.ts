import * as Y from 'yjs'
import { makeAutoObservable, toJS } from 'mobx'
import { ESUser, FollowRequest, NotificationInfo, NotificationType } from '@newturn-develop/types-molink'
import UserAPI from '../../../api/UserAPI'
import ViewerAPI from '../../../api/ViewerAPI'
import { Notification } from '../../../domain/Notification'
import NotificationAPI from '../../../api/NotificationAPI'
import { Page } from '../RoutingManager'

export class UserNotification {
    _notifications: Notification[] = null

    get notifications (): Notification[] {
        return toJS(this._notifications)
    }

    get isNewNotificationExist () {
        return this._notifications.filter(noti => !noti.isViewed).length > 0
    }

    constructor () {
        makeAutoObservable(this)
    }

    getNotificationMessage (causeUser: ESUser, notificationInfo: NotificationInfo) {
        switch (notificationInfo.notificationType) {
        case NotificationType.NewFollow:
            return `새로운 팔로워: ${causeUser.nickname}님`
        case NotificationType.FollowAccept:
            return `${causeUser.nickname}님이 팔로우 요청을 수락하셨습니다.`
        default:
            throw new Error('Unhandled Notification Type')
        }
    }

    async load () {
        const infoList = await UserAPI.getNotifications()
        console.log(infoList)
        const requiredUserMap = {}
        for (const info of infoList) {
            if (info.causedUserId && !requiredUserMap[info.causedUserId]) {
                requiredUserMap[info.causedUserId] = true
            }
        }
        const userIDList = [...Object.keys(requiredUserMap)] as any
        const { infoMap } = await ViewerAPI.getUserInfoMapByIDList(userIDList)
        const notifications = []
        for (const info of infoList) {
            const userInfo = infoMap[info.causedUserId]
            notifications.push(new Notification('1', userInfo.profileImageUrl, this.getNotificationMessage(userInfo, info), info.isViewed, new Date(info.createdAt), Page.Blog, `/${userInfo.nickname}`))
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
