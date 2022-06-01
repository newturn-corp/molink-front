import { makeAutoObservable } from 'mobx'
import { UserPageList } from '../../Blog/UserPageList'
import { BlogUserInfo } from '../../Blog/BlogUserInfo'

export enum BlogPageType {
    UserMainPage,
    NormalPage
}

class Blog {
    id: number
    userPageList: UserPageList = null
    blogUserInfo: BlogUserInfo = null
    pageType: BlogPageType = BlogPageType.NormalPage

    constructor () {
        makeAutoObservable(this)
    }

    load (userId: number) {
        this.id = userId
        this.userPageList = new UserPageList(userId)
        this.blogUserInfo = new BlogUserInfo()
    }

    clear () {
        this.userPageList?.clear()
        this.blogUserInfo?.clear()
    }

    async loadUserPageList () {
        await this.userPageList.loadPageSummaryList()
    }

    async loadBlogUserInfo () {
        await this.blogUserInfo.load(this.id)
    }
}
export default new Blog()
