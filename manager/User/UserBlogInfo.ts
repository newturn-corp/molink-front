import { makeAutoObservable, toJS } from 'mobx'
import ViewerUserAPI from '../../api/Viewer/ViewerUserAPI'
import { ESBlog } from '@newturn-develop/types-molink'

export class UserBlogInfo {
    _blogs: ESBlog[] = null

    constructor () {
        makeAutoObservable(this)
    }

    get blogs () {
        return toJS(this._blogs)
    }

    async load (userID: number) {
        this._blogs = await ViewerUserAPI.getUserBlogs(userID)
        console.log(this.blogs)
    }
}
