import { UserPageList } from '../../Blog/UserPageList'
import { BlogUserInfo } from '../../Blog/BlogUserInfo'
import { BlogPageHierarchy } from './BlogPageHierarchy'
import { makeAutoObservable } from 'mobx'
import UserManager from '../User/UserManager'

class Blog {
    id: number = null
    isOpen: boolean = true
    userPageList: UserPageList = null
    blogUserInfo: BlogUserInfo = null
    pageHierarchy: BlogPageHierarchy = null

    constructor () {
        makeAutoObservable(this)
    }

    async load (id: number) {
        if (this.id === id) {
            return
        } else {
            this.reset()
        }
        this.id = id
        this.pageHierarchy = new BlogPageHierarchy()
        await this.pageHierarchy.load(id)
        this.blogUserInfo = new BlogUserInfo()
        await this.blogUserInfo.load(id)
        this.userPageList = new UserPageList(this.id)
    }

    reset () {
        if (this.pageHierarchy) {
            this.pageHierarchy.reset()
        }
        if (this.blogUserInfo) {
            this.blogUserInfo.reset()
        }
        if (this.userPageList) {
            this.userPageList.clear()
        }
    }

    getBlogWidth () {
        if (!this.isOpen) {
            return UserManager.isUserAuthorized ? 30 : 0
        }
        return UserManager.setting ? UserManager.setting.hierarchyWidth : 240
    }
}
export default new Blog()
