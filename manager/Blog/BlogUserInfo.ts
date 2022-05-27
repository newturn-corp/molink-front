import ViewerAPI from '../../api/ViewerAPI'
import { ESUser, FollowStatus } from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'

export class BlogUserInfo {
    userId: number
    nickname: string = '사용자'
    profileImageUrl: string = ''
    biography: string = ''
    followerCount: number = 0
    followCount: number = 0

    constructor () {
        makeAutoObservable(this)
    }

    async load (userId: number) {
        await Promise.all([this.loadUserInfo(userId), this.loadFollowInfo(userId)])
    }

    async loadUserInfo (userId: number) {
        const dto = await ViewerAPI.getUserInfoMapByIDList([userId])
        const userInfo = dto.infoMap[userId] as ESUser
        this.userId = userId
        this.nickname = userInfo.nickname
        this.profileImageUrl = userInfo.profileImageUrl
        this.biography = userInfo.biography
    }

    async loadFollowInfo (userId: number) {
        const dto = await ViewerAPI.getUserFollowInfo(userId)
        this.followerCount = dto.followerCount
        this.followCount = dto.followCount
    }
}
