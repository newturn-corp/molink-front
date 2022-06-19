import { makeAutoObservable } from 'mobx'
import * as Y from 'yjs'
import ViewerBlogAPI from '../../../api/Viewer/ViewerBlogAPI'

export class BlogProfile {
    yProfile: Y.Map<any> = null
    public name: string = null
    public profileImageURL: string | null = null
    public biography: string | null = null
    public followerCount: number = 0

    constructor (yProfile: Y.Map<any>) {
        this.yProfile = yProfile
        this.yProfile.observeDeep(() => {
            this.name = this.yProfile.get('name')
            this.profileImageURL = this.yProfile.get('profileImageURL')
            this.biography = this.yProfile.get('biography')
        })
        makeAutoObservable(this, {
            yProfile: false
        })
    }

    async load (blogID: number) {
        const { count } = await ViewerBlogAPI.getBlogFollowerCount(blogID)
        this.followerCount = count
    }

    reset () {
        this.yProfile = null
        this.name = null
        this.profileImageURL = null
        this.followerCount = 0
    }
}
