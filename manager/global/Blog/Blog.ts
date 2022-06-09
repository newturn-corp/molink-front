import { UserPageList } from '../../Blog/UserPageList'
import { BlogUserInfo } from '../../Blog/BlogUserInfo'
import { BlogPageHierarchy } from './BlogPageHierarchy'
import { makeAutoObservable } from 'mobx'
import UserManager from '../User/UserManager'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'

class Blog {
    id: number = null
    isOpen: boolean = true
    userPageList: UserPageList = null
    blogUserInfo: BlogUserInfo = null
    pageHierarchy: BlogPageHierarchy = null

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.UserAuthorization, async ({ result }: any) => {
            if (result) {
                this.reset()
                await this.load(UserManager.userId)
            }
        }, 1)
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
        this.id = null
        if (this.pageHierarchy) {
            this.pageHierarchy.reset()
            this.pageHierarchy = null
        }
        if (this.blogUserInfo) {
            this.blogUserInfo.reset()
            this.blogUserInfo = null
        }
        if (this.userPageList) {
            this.userPageList.clear()
            this.userPageList = null
        }
    }

    getBlogWidth () {
        if (this.isOpen && this.pageHierarchy) {
            return UserManager.setting ? UserManager.setting.hierarchyWidth : 240
        } else {
            return UserManager.isUserAuthorized ? 30 : 0
        }
    }
}
export default new Blog()
