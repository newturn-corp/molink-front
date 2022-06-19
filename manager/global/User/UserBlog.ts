import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { Transaction, YEvent } from 'yjs'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import EditorPage from '../../Blog/Editor/EditorPage'
import Blog from '../Blog/Blog'

// 총 업로드 용량은 Insert Node, Set Node에서 차감되고, removeNodes에서 복구된다.
export class UserLimit {
    yBlog: Y.Array<any> = null
    blogs: string[]
    listener: (arg0: YEvent<any>[], arg1: Transaction) => void = null

    constructor () {
        makeAutoObservable(this, {
            yBlog: false
        })
    }

    sync (yBlog: Y.Array<any>) {
        this.yBlog = yBlog
        this.listener = () => {
            const blogs = this.yBlog.toJSON()
        }
        this.yBlog.observeDeep(this.listener)
    }

    reset () {
        if (this.yBlog) {
            this.yBlog.unobserveDeep(this.listener)
        }
        this.yBlog = null
    }
}
