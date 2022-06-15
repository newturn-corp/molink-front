import { ESPageSearchResult, ESUser } from '@newturn-develop/types-molink'
import ViewerSearchAPI from '../../api/Viewer/ViewerSearchAPI'
import { makeAutoObservable, toJS } from 'mobx'
import UserInfoMap from '../global/User/UserInfoMap'

export class PageSearchEngine {
    searchResultCountPerPage = 7
    _searchResults: ESPageSearchResult[] = null
    searchText: string = null
    isSearching = false
    total: number = 0
    page: number = 0

    get searchResults () {
        return toJS(this._searchResults)
    }

    constructor () {
        makeAutoObservable(this)
    }

    async search (text: string, page: number) {
        if (this.isSearching) {
            return
        }
        this.isSearching = true
        this.searchText = text
        this.page = page
        const from = (page - 1) * this.searchResultCountPerPage
        const dto = await ViewerSearchAPI.searchPage(text, from, this.searchResultCountPerPage)
        await UserInfoMap.updateUserInfoMapByUserIDList(dto.results.map(result => result.userId))
        this.total = dto.total
        this._searchResults = dto.results
        this.isSearching = false
    }

    clear () {
        this.total = 0
        this.page = 0
        this._searchResults = null
        this.searchText = null
    }
}
