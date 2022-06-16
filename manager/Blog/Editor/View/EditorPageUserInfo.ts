import { makeAutoObservable } from 'mobx'
import UserInfoMap from '../../../global/User/UserInfoMap'
import ViewerAPI from '../../../../api/ViewerAPI'

export class EditorPageUserInfo {
    userId: number
    nickname: string = null
    userProfileImageUrl: string = null
    biography: string = null
    followerCount: number = 0
    followCount: number = 0

    constructor (userId: number) {
        this.userId = userId
        makeAutoObservable(this)
    }

    async load () {
        const infoMap = await UserInfoMap.getUserInfoMapByUserIDList([this.userId])
        const userInfo = infoMap[this.userId]
        this.nickname = userInfo.nickname
        this.userProfileImageUrl = userInfo.profileImageUrl
        this.biography = userInfo.biography
        const dto = await ViewerAPI.getUserFollowInfo(this.userId)
        this.followerCount = dto.followerCount
        this.followCount = dto.followCount
    }
}
