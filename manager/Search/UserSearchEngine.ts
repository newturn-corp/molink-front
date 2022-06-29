import { ESUser } from '@newturn-develop/types-molink'
import ViewerSearchAPI from '../../api/Viewer/ViewerSearchAPI'
import { makeAutoObservable } from 'mobx'
import { SearchEngine } from './SearchEngine'

export class UserSearchEngine implements SearchEngine {
    searchResultCountPerPage = 10
    searchResults: ESUser[] = null
    searchText: string = null
    isSearching = false
    total: number = 0
    page: number = 0

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
        const from = (page - 1) * 10
        const dto = await ViewerSearchAPI.searchUser(text, from, this.searchResultCountPerPage)
        this.total = dto.total
        this.searchResults = dto.results
        this.isSearching = false
    }

    clear () {
        this.total = 0
        this.page = 0
        this.searchResults = null
        this.searchText = null
    }
}
