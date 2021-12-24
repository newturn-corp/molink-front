import { makeAutoObservable } from 'mobx'
import UserAPI from '../api/UserAPI'
import EventManager, { Event } from './EventManager'

class UserManager {
    isUserAuthorized: boolean = false
    isAuthorizing: boolean = false
    userId: number
    email: string
    nickname: string
    representativeDocumentId: string | null

    constructor () {
        makeAutoObservable(this)
    }

    async updateUserProfile () {
        if (!this.isUserAuthorized) {
            this.isAuthorizing = true
            try {
                const dto = await UserAPI.getUserProfile()
                this.userId = dto.userId
                this.email = dto.email
                this.nickname = dto.nickname
                this.representativeDocumentId = dto.representativeDocumentId
                EventManager.issueEvent(Event.UserProfileInited, {})

                EventManager.issueEvent(Event.UserAuthorization, { result: true })
                this.isUserAuthorized = true
            } catch (err) {
                EventManager.issueEvent(Event.UserAuthorization, { result: false })
                this.isUserAuthorized = false
            } finally {
                this.isAuthorizing = false
            }
        }
    }
}
export default new UserManager()
