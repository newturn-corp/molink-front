import { makeAutoObservable } from 'mobx'
import FollowAPI from '../api/FollowAPI'
import { AcceptFollowRequestDTO, RejectFollowRequestDTO } from '../DTO/FollowDTO'

export class FollowRequest {
    id: number
    profileImgUrl: string | null
    nickname: string
    isViewed: boolean
    isHandled: boolean = false
    createdAt: Date

    constructor (id: number, profileImgUrl: string | null, nickname: string, isViewed: boolean, createdAt: Date) {
        makeAutoObservable(this)
        this.id = id
        this.profileImgUrl = profileImgUrl
        this.nickname = nickname
        this.isViewed = isViewed
        this.createdAt = createdAt
    }

    async accept () {
        this.isHandled = true
        await FollowAPI.acceptFollowRequest(new AcceptFollowRequestDTO(this.id))
    }

    async reject () {
        this.isHandled = true
        await FollowAPI.rejectFollowRequest(new RejectFollowRequestDTO(this.id))
    }
}
