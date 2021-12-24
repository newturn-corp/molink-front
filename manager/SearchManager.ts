import { makeAutoObservable, toJS } from 'mobx'
import UserAPI from '../api/UserAPI'
import { SearchUserDTO } from '../DTO/UserDTO'

class SearchManager {
    _searchResults = []
    isSearching = false

    get searchResults () {
        return toJS(this._searchResults)
    }

    constructor () {
        makeAutoObservable(this)
    }

    async search (text: string) {
        if (this.isSearching) {
            return
        }
        this.isSearching = true
        const results = await UserAPI.searchUsers(new SearchUserDTO(text))
        console.log(results)
        this._searchResults = results.userSearchResults.map(result => {
            return {
                nickname: result.nickname
            }
        })
        this.isSearching = false
    }
}
export default new SearchManager()
