import { Page } from '../manager/global/RoutingManager'

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
    moveToPage: Page | null
    moveTo: string | null
    createdAt: Date

    constructor (id: string, imgUrl: string | null, msg: string, isViewed: boolean, createdAt: Date, moveToPage: Page | null, moveTo: string | null) {
        this.id = id
        this.imgUrl = imgUrl
        this.msg = msg
        this.isViewed = isViewed
        this.createdAt = createdAt
        this.moveToPage = moveToPage
        this.moveTo = moveTo
    }
}
