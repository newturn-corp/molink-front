import { makeAutoObservable, toJS } from 'mobx'
import UserAPI from '../api/UserAPI'
import { GetUserRepresentativeDocumentURLDTO, SearchUserDTO } from '../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../Errors/UserError'
import NotificationManager, { NOTIFICATION_TYPE } from './NotificationManager'
import RoutingManager, { Page } from './RoutingManager'

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
        this._searchResults = results.userSearchResults.map(result => {
            return {
                id: result.id,
                nickname: result.nickname
            }
        })
        this.isSearching = false
    }

    async moveBySearchResult (userId: number) {
        try {
            const { url } = await UserAPI.getUserRepresentativeDocumentUrl(new GetUserRepresentativeDocumentURLDTO(userId))
            RoutingManager.moveTo(Page.Index, url)
        } catch (err) {
            if (err instanceof UserNotExists) {
                NotificationManager.showNotification(NOTIFICATION_TYPE.ERROR, '유저가 존재하지 않습니다.', '')
            } else if (err instanceof RepresentativeDocumentNotExists) {
                NotificationManager.showNotification(NOTIFICATION_TYPE.ERROR, '유저의 공개된 문서가 존재하지 않습니다.', '')
            }
        }
    }
}
export default new SearchManager()
