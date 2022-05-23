import { ESPageSummary, ESUser, GetUserInfoByUserMapDTO } from '@newturn-develop/types-molink'
import ViewerAPI from '../../api/ViewerAPI'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import BlogManager from './BlogManager'
import { makeAutoObservable, toJS } from 'mobx'
import { throttle } from 'lodash'

export class FollowPageList {
    _pageSummaryList: ESPageSummary[] = []
    from: number = 0
    listEnded: boolean = false
    userMap: { [index: number]: ESUser } = {}
    totalPageCount: number = 0
    userId: number

    constructor () {
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
        const { total, results } = await ViewerAPI.getFollowPageList(this.from, 8)
        this.totalPageCount = total
        if (results.length === 0) {
            this.listEnded = true
            return
        }
        const requiredUserMap = {}
        for (const summary of results) {
            if (!this.userMap[summary.userId] && !requiredUserMap[summary.userId]) {
                requiredUserMap[summary.userId] = true
            }
        }
        if (Object.keys(requiredUserMap).length !== 0) {
            const userIDList = [...Object.keys(requiredUserMap)] as any
            const { infoMap } = await ViewerAPI.getUserInfoMapByIDList(userIDList)
            this.userMap = { ...this.userMap, ...infoMap }
        }
        this._pageSummaryList.push(...results)
        this.from += results.length
    }

    clear () {
        this._pageSummaryList = []
        this.from = 0
        this.listEnded = false
    }
}
