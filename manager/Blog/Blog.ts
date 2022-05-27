import { UserPageList } from './UserPageList'
import { BlogUserInfo } from './BlogUserInfo'
import { makeAutoObservable } from 'mobx'

export enum BlogPageType {
    UserMainPage,
    NormalPage
}

export class Blog {
    id: number
    userPageList: UserPageList
    blogUserInfo: BlogUserInfo
    pageType: BlogPageType = BlogPageType.NormalPage

    constructor (id: number) {
        this.id = id
        this.userPageList = new UserPageList(id)
        this.blogUserInfo = new BlogUserInfo()
        makeAutoObservable(this)
    }

    async loadUserPageList () {
        await this.userPageList.loadPageSummaryList()
    }
}
