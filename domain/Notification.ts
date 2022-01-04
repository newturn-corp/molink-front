export enum NotificationType {
    Default = 'default',
    FollowRequest = 'follow-request',
    NewFollow = 'new-follow',
    FollowAcception = 'follow-acception'
}

export class Notification {
    id: string
    imgUrl: string | null
    msg: string
    isViewed: boolean
    createdAt: Date

    constructor (id: string, imgUrl: string | null, msg: string, isViewed: boolean, createdAt: Date) {
        this.id = id
        this.imgUrl = imgUrl
        this.msg = msg
        this.isViewed = isViewed
        this.createdAt = createdAt
    }
}
