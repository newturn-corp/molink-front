import ViewerAPI from '../../api/ViewerAPI'
import { ESUser, FollowStatus } from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'
import UserInfoMap from '../global/User/UserInfoMap'

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
        const infoMap = await UserInfoMap.getUserInfoMapByUserIDList([userId])
        const userInfo = infoMap[userId] as ESUser
        this.userId = userId
        this.nickname = userInfo.nickname
        this.profileImageUrl = userInfo.profileImageUrl
        this.biography = userInfo.biography
        const dto = await ViewerAPI.getUserFollowInfo(userId)
        this.followerCount = dto.followerCount
        this.followCount = dto.followCount
    }

    reset () {
        this.nickname = '사용자'
        this.profileImageUrl = ''
        this.biography = ''
        this.followerCount = 0
        this.followCount = 0
    }
}
