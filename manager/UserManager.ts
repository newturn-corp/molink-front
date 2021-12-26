import { ThreeDRotationSharp } from '@material-ui/icons'
import { makeAutoObservable } from 'mobx'
import React from 'react'
import UserAPI from '../api/UserAPI'
import { UpdateUserBiographyDTO, UpdateUserProfileImageDto } from '../DTO/UserDTO'
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
                this.profileImageUrl = dto.profileImageUrl
                this.biography = dto.biography
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
}
export default new UserManager()
