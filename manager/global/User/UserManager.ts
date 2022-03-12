import { makeAutoObservable } from 'mobx'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { UserSetting } from './UserSetting'
import EventManager from '../Event/EventManager'
import { HierarchyNotExists } from '../../../Errors/HierarchyError'
import { Event } from '../Event/Event'
import UserAPI from '../../../api/UserAPI'
import { UserProfile } from './UserProfile'

class UserManager {
    isUserAuthorized: boolean = false
    isLoading: boolean = false
    isUserMenuOpen: boolean = false
    userId: number = null

    yjsDocument: Y.Doc = null
    websocketProvider: WebsocketProvider = null
    profile: UserProfile
    setting: UserSetting

    constructor () {
        makeAutoObservable(this, {
            yjsDocument: false,
            websocketProvider: false
        })

        this.profile = new UserProfile()
        this.setting = new UserSetting()

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

            this.websocketProvider = new WebsocketProvider(
                process.env.USER_SERVER_URL,
                this.userId.toString(),
                this.yjsDocument, {
                    connect: false
                })
            return new Promise<void>((resolve, reject) => {
                let isResolved = false

                this.websocketProvider.on('status', (event) => {
                    console.log(event)
                })

                this.websocketProvider.on('sync', async (isSynced: boolean) => {
                    if (isSynced) {
                        isResolved = true
                        await EventManager.issueEvent(Event.UserAuthorization, { result: true })
                        this.isUserAuthorized = true
                        this.isLoading = false
                        resolve()
                    }
                })
                this.websocketProvider.connect()
                setTimeout(() => {
                    if (!isResolved) {
                        this.isLoading = false
                        reject(new HierarchyNotExists())
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
        this.userId = null
        this.isUserAuthorized = false
        this.yjsDocument = null
        this.websocketProvider = null
    }
}
export default new UserManager()
