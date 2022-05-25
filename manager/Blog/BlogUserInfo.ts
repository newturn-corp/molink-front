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

    constructor (userId: number) {
        this.userId = userId
        this.loadUserInfo()
        this.loadFollowInfo()
        makeAutoObservable(this)
    }

    async loadUserInfo () {
        const dto = await ViewerAPI.getUserInfoMapByIDList([this.userId])
        const userInfo = dto.infoMap[this.userId] as ESUser
        this.nickname = userInfo.nickname
        this.profileImageUrl = userInfo.profileImageUrl
        this.biography = userInfo.biography
    }

    async loadFollowInfo () {
        const dto = await ViewerAPI.getUserFollowInfo(this.userId)
        this.followerCount = dto.followerCount
        this.followCount = dto.followCount
    }
}
