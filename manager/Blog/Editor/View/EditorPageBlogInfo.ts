import { makeAutoObservable } from 'mobx'
import UserInfoMap from '../../../global/User/UserInfoMap'
import ViewerAPI from '../../../../api/ViewerAPI'
import BlogInfoMap from '../../../global/Blog/BlogInfoMap'
import ViewerBlogAPI from '../../../../api/Viewer/ViewerBlogAPI'

export class EditorPageBlogInfo {
    blogID: number
    name: string = null
    profileImageUrl: string = null
    biography: string = null
    followerCount: number = 0

    constructor (blogID: number) {
        this.blogID = blogID
        makeAutoObservable(this)
    }

    async load () {
        const infoMap = await BlogInfoMap.getBlogInfoMapByBlogIDList([this.blogID])
        const blogInfo = infoMap[this.blogID]
        this.name = blogInfo.name
        this.profileImageUrl = blogInfo.profileImageURL
        this.biography = blogInfo.biography
        const dto = await ViewerBlogAPI.getBlogFollowerCount(this.blogID)
        this.followerCount = dto.count
    }
}
