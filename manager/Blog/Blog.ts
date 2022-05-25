import { UserPageList } from './UserPageList'
import { BlogUserInfo } from './BlogUserInfo'
import { makeAutoObservable } from 'mobx'

export class Blog {
    id: number
    userPageList: UserPageList
    blogUserInfo: BlogUserInfo

    constructor (id: number) {
        this.id = id
        this.userPageList = new UserPageList(id)
        this.blogUserInfo = new BlogUserInfo(id)
        makeAutoObservable(this)
    }

    async loadUserPageList () {
        await this.userPageList.loadPageSummaryList()
    }
}
