import { ESPageSummary, ESUser, GetUserInfoByUserMapDTO } from '@newturn-develop/types-molink'
import ViewerAPI from '../../api/ViewerAPI'
import { makeAutoObservable, toJS } from 'mobx'
import { debounce, throttle } from 'lodash'

export class UserPageList {
    _pageSummaryList: ESPageSummary[] = []
    from: number = 0
    listEnded: boolean = false
    userMap: { [index: number]: ESUser } = {}
    totalPageCount: number = 0
    userId: number

    constructor (userId: number) {
        this.userId = userId
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
        const { total, results } = await ViewerAPI.getUserPageList(this.userId, this.from)
        this.totalPageCount = total
        console.log(this.totalPageCount)
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
