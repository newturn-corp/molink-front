import { ESPageSummary, ESUser, GetPageListDTO, GetUserInfoByUserMapDTO } from '@newturn-develop/types-molink'
import ViewerAPI from '../../../api/ViewerAPI'
import { makeAutoObservable, toJS } from 'mobx'
import { debounce, throttle } from 'lodash'
import UserInfoMap from '../User/UserInfoMap'
import ViewerBlogAPI from '../../../api/Viewer/ViewerBlogAPI'
import BlogInfoMap from './BlogInfoMap'

export class BlogPageList {
    _pageSummaryList: ESPageSummary[] = []
    from: number = 0
    listEnded: boolean = false
    totalPageCount: number = 0
    blogID: number

    constructor (blogID: number) {
        this.blogID = blogID
        makeAutoObservable(this)
    }

    get pageSummaryList () {
        return toJS(this._pageSummaryList)
    }

    get loadPageSummaryList () {
        return throttle(this._loadPageSummaryList, 1000)
    }

    async _loadPageSummaryList () {
        if (this.listEnded) {
            return
        }
        const { total, results } = await ViewerBlogAPI.getBlogPageList(this.blogID, new GetPageListDTO(this.from, 6))
        this.totalPageCount = total
        if (results.length === 0) {
            this.listEnded = true
            return
        }
        const blogIDList = Array.from(new Set(results.map(summary => Number(summary.blogID))))
        await BlogInfoMap.updateByIDList(blogIDList)
        this._pageSummaryList.push(...results)
        this.from += results.length
    }

    clear () {
        this._pageSummaryList = []
        this.from = 0
        this.listEnded = false
    }
}
