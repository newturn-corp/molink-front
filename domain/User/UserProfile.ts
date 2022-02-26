import { makeAutoObservable } from 'mobx'
import UserAPI from '../../api/UserAPI'
import { UpdateUserBiographyDTO } from '../../DTO/UserDTO'

export default class UserProfile {
    userId: number
    email: string
    nickname: string
    representativeDocumentId: string
    biography: string
    profileImageUrl: string

    constructor (userId: number, email: string, nickname: string, representativeDocumentId: string, biography: string, profileImageUrl: string) {
        makeAutoObservable(this)
        this.userId = userId
        this.email = email
        this.nickname = nickname
        this.biography = biography
        this.representativeDocumentId = representativeDocumentId
        this.profileImageUrl = profileImageUrl
    }

    async updateUserBiography () {
        await UserAPI.updateUserBiography(new UpdateUserBiographyDTO(this.biography))
    }
}
