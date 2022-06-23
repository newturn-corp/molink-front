import { makeAutoObservable } from 'mobx'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import UserAPI from '../../../api/UserAPI'
import { UserProfile } from './UserProfile'
import { UserLimit } from './UserLimit'
import { UserNotExists } from '../../../Errors/UserError'
import { UserNotification } from './UserNotification'
import { UserFollow } from './UserFollow'
import { UserETC } from './UserETC'
import { UserSetting } from './UserSetting'
import { UserBlog } from './UserBlog'

class UserManager {
    isUserAuthorized: boolean = false
    isLoading: boolean = false
    isUserMenuOpen: boolean = false
    isUserDrawerOpen: boolean = false
    userId: number = null

    yjsDocument: Y.Doc = null
    websocketProvider: WebsocketProvider = null
    profile: UserProfile
    setting: UserSetting
    limit: UserLimit
    notification: UserNotification
    follow: UserFollow
    etc: UserETC
    blog: UserBlog

    constructor () {
        makeAutoObservable(this, {
            yjsDocument: false,
            websocketProvider: false
        })

        this.profile = new UserProfile()
        this.setting = new UserSetting()
        this.limit = new UserLimit()
        this.notification = new UserNotification()
        this.follow = new UserFollow()
        this.etc = new UserETC()
        this.blog = new UserBlog()

        EventManager.addEventListener(Event.SignOut, () => {
            this.reset()
        }, 5)
        EventManager.addEventListener(Event.PageBodyClick, () => {
            this.isUserMenuOpen = false
        }, 1)
    }

    async load () {
        if (this.isLoading || this.isUserAuthorized) {
            return
        }
        try {
            this.isLoading = true
            this.userId = await UserAPI.getUserID()
            this.yjsDocument = new Y.Doc()

            this.profile.sync(this.yjsDocument.getMap<any>('profile'))
            this.setting.sync(this.yjsDocument.getMap<any>('setting'), this.yjsDocument)
            this.limit.sync(this.yjsDocument.getMap<any>('limit'))
            this.etc.sync(this.yjsDocument.getMap<any>('etc'))
            this.blog.sync(this.yjsDocument.getArray<number>('blog'))
            await this.notification.load()
            await this.follow.load()

            this.websocketProvider = new WebsocketProvider(
                process.env.USER_SERVER_URL,
                this.userId.toString(),
                this.yjsDocument, {
                    connect: false
                })
            return new Promise<void>((resolve, reject) => {
                let isResolved = false

                const checkResolved = {
                    blog: false,
                    profile: false
                }
                const resolver = async () => {
                    if (isResolved) {
                        return
                    }
                    isResolved = true
                    this.isUserAuthorized = true
                    this.isLoading = false
                    await EventManager.issueEvent(Event.UserAuthorization, { result: true })
                    resolve()
                }
                const blogListener = async () => {
                    console.log('blogListener')
                    checkResolved.blog = true
                    this.blog.yBlog.unobserveDeep(blogListener)
                    if (Object.values(checkResolved).filter(v => !v).length === 0) {
                        await resolver()
                    }
                }
                const profileListener = async () => {
                    console.log('profileListener')
                    checkResolved.profile = true
                    this.profile.yProfile.unobserveDeep(profileListener)
                    if (Object.values(checkResolved).filter(v => !v).length === 0) {
                        await resolver()
                    }
                }
                this.profile.yProfile.observeDeep(profileListener)
                this.blog.yBlog.observeDeep(blogListener)
                this.websocketProvider.connect()
                setTimeout(() => {
                    if (!isResolved) {
                        if (!checkResolved.profile) {
                            this.profile.yProfile.unobserveDeep(profileListener)
                        }
                        if (!checkResolved.blog) {
                            this.blog.yBlog.unobserveDeep(blogListener)
                        }
                        reject(new UserNotExists())
                    }
                }, 10000)
            })
        } catch (err) {
            console.log(err)
            await EventManager.issueEvent(Event.UserAuthorization, { result: false })
            this.isUserAuthorized = false
            this.isLoading = false
        }
    }

    reset () {
        if (this.websocketProvider) {
            this.websocketProvider.destroy()
        }
        this.profile.reset()
        this.setting.reset()
        this.limit.reset()
        this.notification.reset()
        this.etc.reset()
        this.userId = null
        this.isUserAuthorized = false
        this.yjsDocument = null
        this.websocketProvider = null
    }
}
export default new UserManager()
