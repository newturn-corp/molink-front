import { makeAutoObservable } from 'mobx'
import UserManager from '../User/UserManager'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import * as Y from 'yjs'
import { BlogSetting } from './BlogSetting'
import ViewerAPI from '../../../api/ViewerAPI'
import { BlogAuthority } from '@newturn-develop/types-molink'
import { BlogNotExists } from '../../../Errors/BlogError'
import { BlogSynchronizer } from './PageHierarchy/BlogSynchronizer'
import { BlogProfile } from './BlogProfile'
import { BlogPageList } from './BlogPageList'
import { BlogUserInfo } from './BlogUserInfo'
import { BlogPageHierarchy } from './PageHierarchy/BlogPageHierarchy'
import DialogManager from '../DialogManager'
import LanguageManager from '../LanguageManager'
import RoutingManager, { Page } from '../RoutingManager'

class Blog {
    id: number = null
    isOpen: boolean = true
    public yDocument: Y.Doc
    public synchronizer: BlogSynchronizer
    authority: BlogAuthority = null
    profile: BlogProfile = null
    setting: BlogSetting = null
    blogPageList: BlogPageList = null
    blogUserInfo: BlogUserInfo = null
    pageHierarchy: BlogPageHierarchy = null

    constructor () {
        this.yDocument = new Y.Doc()
        makeAutoObservable(this)

        // UserSetting EventListener
        EventManager.addEventListener(Event.UserAuthorization, async ({ result }: any) => {
            if (result) {
                this.reset()
                if (UserManager.blog?.blogs[0]) {
                    await this.load(UserManager.blog.blogs[0])
                }
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
        this.authority = await ViewerAPI.getBlogAuthority(id)
        console.log(this.authority)
        if (!this.authority.viewable) {
            this.reset()
            await DialogManager.openDialog('블로그가 존재하지 않습니다.', '메인 페이지로 이동합니다.', [LanguageManager.languageMap.Accept])
            await RoutingManager.moveTo(Page.Index)
            throw new BlogNotExists()
        }
        this.pageHierarchy = new BlogPageHierarchy(this.yDocument)
        // this.blogUserInfo = new BlogUserInfo()
        this.blogPageList = new BlogPageList(this.id)
        this.setting = new BlogSetting(this.yDocument.getMap('setting'))
        this.profile = new BlogProfile(this.yDocument.getMap('profile'))

        await Promise.all([
            // this.blogUserInfo.load(id),
            this.profile.load(id)
        ])

        if (this.authority.editable) {
            this.synchronizer = new BlogSynchronizer(this.id, this.yDocument)
            await this.synchronizer.connect(this.profile.yProfile)
            await this.pageHierarchy.loadEditingComponent()
        } else {
            const dto = await ViewerAPI.getBlog(this.id)
            Y.applyUpdate(this.yDocument, Uint8Array.from(dto.hierarchy))
        }
    }

    reset () {
        this.id = null
        this.authority = null
        if (this.synchronizer) {
            this.synchronizer.reset()
            this.synchronizer = null
        }
        if (this.pageHierarchy) {
            this.pageHierarchy.reset()
            this.pageHierarchy = null
        }
        if (this.blogPageList) {
            this.blogPageList.clear()
            this.blogPageList = null
        }
        if (this.profile) {
            this.profile.reset()
            this.profile = null
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
