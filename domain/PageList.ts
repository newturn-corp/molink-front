import {
    ESPageSummary,
    GetPageListResponseDTO
} from '@newturn-develop/types-molink'
import { action, computed, makeObservable, observable } from 'mobx'
import { throttle } from 'lodash'
import UserInfoMap from '../manager/global/User/UserInfoMap'

export class PageList {
    pageSummaryList: ESPageSummary[] = []
    from: number = 0
    pageCountPerRequest: number = 5
    listEnded: boolean = false
    totalPageCount: number = 0
    isLoading: boolean = false
    private getPageList: (from: number, count: number) => Promise<GetPageListResponseDTO>

    constructor (pageCountForEveryRequest: number, getPageList: (from: number, count: number) => Promise<GetPageListResponseDTO>) {
        this.pageCountPerRequest = pageCountForEveryRequest
        this.getPageList = getPageList
        makeObservable(this, {
            listEnded: observable,
            pageSummaryList: observable,
            totalPageCount: observable,
            loadPageSummaryList: computed,
            _loadPageSummaryList: action,
            clear: action
        })
    }
    //
    // get pageSummaryList () {
    //     return toJS(this._pageSummaryList)
    // }

    get loadPageSummaryList () {
        return throttle(this._loadPageSummaryList, 2000)
    }

    async _loadPageSummaryList () {
        if (this.listEnded || this.isLoading) {
            return
        }
        this.isLoading = true
        const { total, results } = await this.getPageList(this.from, this.pageCountPerRequest)
        this.totalPageCount = total
        if (results.length === 0) {
            this.listEnded = true
            return
        }
        const userIDList = Array.from(new Set(results.map(summary => Number(summary.userId))))
        await UserInfoMap.updateUserInfoMap(userIDList)
        this.pageSummaryList.push(...results)
        this.from += results.length
        this.isLoading = false
    }

    clear () {
        this.pageSummaryList = []
        this.from = 0
        this.listEnded = false
        this.isLoading = false
    }
}
