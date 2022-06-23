import { ESUser, FollowStatus } from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'
import UserInfoMap from '../User/UserInfoMap'
import ViewerBlogAPI from '../../../api/Viewer/ViewerBlogAPI'

export class BlogUserInfo {
    userId: number
    nickname: string = '사용자'
    profileImageUrl: string = ''
    biography: string = ''
    followerCount: number = 0

    constructor () {
        makeAutoObservable(this)
    }

    async load (userId: number) {
        const infoMap = await UserInfoMap.getUserInfoMapByUserIDList([userId])
        const userInfo = infoMap[userId] as ESUser
        this.userId = userId
        // this.nickname = userInfo.blogName
        // this.profileImageURL = userInfo.profileImageURL
        // this.biography = userInfo.biography
        // const dto = await ViewerBlogAPI.getBlogFollowerCount(this.blogID)
        // this.followerCount = dto.count
    }

    reset () {
        this.nickname = '사용자'
        this.profileImageUrl = ''
        this.biography = ''
        this.followerCount = 0
        // this.followCount = 0
    }
}
