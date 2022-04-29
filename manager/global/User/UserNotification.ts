import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { FollowRequest, Notification } from '@newturn-develop/types-molink'

export class UserNotification {
    yNotification: Y.Map<any> = null

    get followRequests (): FollowRequest[] {
        return this.yNotification.get('followRequests')
    }

    get notifications (): Notification[] {
        return this.yNotification.get('notifications')
    }

    constructor () {
        makeAutoObservable(this, {
            yNotification: false
        })
    }

    sync (yNotification) {
        this.yNotification = yNotification
        if (!this.followRequests) {
            this.yNotification.set('followRequests', [])
        }
        if (!this.notifications) {
            this.yNotification.set('notifications', [])
        }
    }

    reset () {
        this.yNotification = null
    }

    checkIsUncheckedNotificationExists () {
        return (this.followRequests.filter(request => request.isViewed).length + this.notifications.filter(noti => noti.isViewed).length) > 0
    }

    acceptFollowRequest () {

    }

    rejectFollowRequest () {

    }
}
