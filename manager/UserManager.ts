import { makeAutoObservable } from 'mobx'
import React from 'react'
import SettingAPI from '../api/SettingAPI'
import UserAPI from '../api/UserAPI'
import UserSetting from '../domain/UserSetting'
import { FollowRequestDTO, UpdateUserBiographyDTO, UpdateUserProfileImageDto } from '../DTO/UserDTO'
import EventManager, { Event } from './EventManager'

class UserManager {
    isUserAuthorized: boolean = false
    isAuthorizing: boolean = false
    userId: number
    email: string
    nickname: string = ''
    biography: string = ''
    profileImageUrl: string = null
    representativeDocumentId: string | null
    setting: UserSetting

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventLinstener(Event.SignOut, () => {
            this.isUserAuthorized = false
            this.isAuthorizing = false
            this.userId = null
            this.email = null
            this.nickname = ''
            this.biography = ''
            this.profileImageUrl = null
            this.setting = null
        }, 1)
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
                this.profileImageUrl = dto.profileImageUrl
                this.biography = dto.biography
                this.setting = await SettingAPI.getUserSetting()
                await EventManager.issueEvent(Event.UserProfileInited, {})
                await EventManager.issueEvent(Event.UserAuthorization, { result: true })
                this.isUserAuthorized = true
            } catch (err) {
                EventManager.issueEvent(Event.UserAuthorization, { result: false })
                this.isUserAuthorized = false
            } finally {
                this.isAuthorizing = false
            }
        }
    }

    async updateUserProfileImage (event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const reader = new FileReader()
        const file = event.target.files[0]
        reader.onloadend = async () => {
            this.profileImageUrl = reader.result as string
            await UserAPI.updateUserProfileImage(new UpdateUserProfileImageDto(file))
        }
        reader.readAsDataURL(file)
    }

    async updateUserBiography () {
        await UserAPI.updateUserBiography(new UpdateUserBiographyDTO(this.biography))
    }

    async follow (userId: number) {
        const result = await UserAPI.follow(new FollowRequestDTO(userId))
        return result.followResult
    }
}
export default new UserManager()
