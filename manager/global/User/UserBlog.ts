import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { Transaction, YEvent } from 'yjs'
import BlogInfoMap from '../Blog/BlogInfoMap'

export class UserBlog {
    yBlog: Y.Array<number> = null
    blogs: number[] = []
    listener: (arg0: YEvent<any>[], arg1: Transaction) => void = null

    constructor () {
        makeAutoObservable(this, {
            yBlog: false,
            listener: false
        })
    }

    sync (yBlog: Y.Array<any>) {
        this.yBlog = yBlog
        this.listener = async () => {
            const blogs = this.yBlog.toJSON()
            this.blogs = blogs
            await BlogInfoMap.updateByIDList(blogs)
        }
        this.yBlog.observeDeep(this.listener)
    }

    reset () {
        if (this.yBlog) {
            this.yBlog.unobserveDeep(this.listener)
        }
        this.yBlog = null
        this.blogs = null
    }
}
