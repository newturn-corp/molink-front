import { Page } from '../manager/global/RoutingManager'

export class BlogNotification {
    imgURL: string | null
    msg: string
    isViewed: boolean
    moveToPage: Page | null
    moveTo: string | null
    createdAt: Date

    constructor (imgURL: string | null, msg: string, isViewed: boolean, moveToPage: Page | null, moveTo: string | null, createdAt: Date) {
        this.imgURL = imgURL
        this.msg = msg
        this.isViewed = isViewed
        this.moveToPage = moveToPage
        this.moveTo = moveTo
        this.createdAt = createdAt
    }
}
