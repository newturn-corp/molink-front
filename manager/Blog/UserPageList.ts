import { ESPageSummary, ESUser, GetPageListDTO, GetUserInfoByUserMapDTO } from '@newturn-develop/types-molink'
import ViewerAPI from '../../api/ViewerAPI'
import { makeAutoObservable, toJS } from 'mobx'
import { debounce, throttle } from 'lodash'
import UserInfoMap from '../global/User/UserInfoMap'

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
        const { total, results } = await ViewerAPI.getUserPageList(this.userId, new GetPageListDTO(this.from, 6))
        this.totalPageCount = total
        if (results.length === 0) {
            this.listEnded = true
            return
        }
        const userIDList = Array.from(new Set(results.map(summary => Number(summary.userId))))
        await UserInfoMap.updateUserInfoMapByUserIDList(userIDList)
        this._pageSummaryList.push(...results)
        this.from += results.length
    }

    clear () {
        this._pageSummaryList = []
        this.from = 0
        this.listEnded = false
    }
}
