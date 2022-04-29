import { makeAutoObservable } from 'mobx'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { UserSetting } from './UserSetting'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import UserAPI from '../../../api/UserAPI'
import { UserProfile } from './UserProfile'
import { UserLimit } from './UserLimit'
import { UserNotExists } from '../../../Errors/UserError'
import { UserNotification } from './UserNotification'
import { UserFollow } from './UserFollow'

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
            this.setting.sync(this.yjsDocument.getMap<any>('setting'))
            this.limit.sync(this.yjsDocument.getMap<any>('limit'))
            this.notification.sync(this.yjsDocument.getMap<any>('notification'))
            this.follow.sync(this.yjsDocument.getMap('myFollowRequests'), this.yjsDocument.getMap('followList'))

            this.websocketProvider = new WebsocketProvider(
                process.env.USER_SERVER_URL,
                this.userId.toString(),
                this.yjsDocument, {
                    connect: false
                })
            return new Promise<void>((resolve, reject) => {
                let isResolved = false

                const listener = async () => {
                    isResolved = true
                    this.profile.yProfile.unobserveDeep(listener)
                    await EventManager.issueEvent(Event.UserAuthorization, { result: true })
                    this.isUserAuthorized = true
                    this.isLoading = false
                    resolve()
                }
                this.profile.yProfile.observeDeep(listener)
                this.websocketProvider.connect()
                setTimeout(() => {
                    if (!isResolved) {
                        this.profile.yProfile.unobserveDeep(listener)
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

    // async updateUserProfileImage (event: React.ChangeEvent<HTMLInputElement>) {
    //     event.preventDefault()
    //     const reader = new FileReader()
    //     const file = event.target.files[0]
    //     reader.onloadend = async () => {
    //         this.profile.profileImageUrl = reader.result as string
    //         await UserAPI.updateUserProfileImage(new UpdateUserProfileImageDto(file))
    //     }
    //     reader.readAsDataURL(file)
    // }

    reset () {
        if (this.websocketProvider) {
            this.websocketProvider.destroy()
        }
        this.profile.reset()
        this.setting.reset()
        this.limit.reset()
        this.notification.reset()
        this.userId = null
        this.isUserAuthorized = false
        this.yjsDocument = null
        this.websocketProvider = null
    }
}
export default new UserManager()
