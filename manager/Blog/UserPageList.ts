import { ESPageSummary, ESUser, GetUserInfoByUserMapDTO } from '@newturn-develop/types-molink'
import ViewerAPI from '../../api/ViewerAPI'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import BlogManager from './BlogManager'
import { makeAutoObservable, toJS } from 'mobx'

export class UserPageList {
    _pageSummaryList: ESPageSummary[] = []
    from: number = 0
    listEnded: boolean = false
    userMap: { [index: number]: ESUser } = {}
    currentListOrder: number = 0
    totalPageCount: number = 0
    userId: number

    constructor () {
        makeAutoObservable(this)
    }

    get pageSummaryList () {
        return toJS(this._pageSummaryList)
    }

    async loadPageSummaryList (userId: number, pageListOrder: number = 0) {
        if (this.listEnded && this.userId === userId) {
            return
        }
        if (this.userId !== userId) {
            this.clear()
            this.userId = userId
        }
        const { total, results } = await ViewerAPI.getUserPageList(userId, pageListOrder * 5)
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
        this._pageSummaryList = results
        this.from += results.length
        this.currentListOrder = pageListOrder
    }

    async handlePageListChange (event, newOrder: number) {
        this.currentListOrder = newOrder
        await this.loadPageSummaryList(newOrder)
    }

    clear () {
        this._pageSummaryList = []
        this.from = 0
        this.listEnded = false
        this.currentListOrder = 0
    }
}
