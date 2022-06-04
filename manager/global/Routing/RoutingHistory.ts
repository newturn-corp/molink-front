import { Page } from '../RoutingManager'

export class RoutingHistory {
    page: Page | null
    extra: string

    constructor (page: Page | null, extra: string) {
        this.page = page
        this.extra = extra
    }
}
