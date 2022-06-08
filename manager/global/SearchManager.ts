import { makeAutoObservable, toJS } from 'mobx'
import UserAPI from '../../api/UserAPI'
import { GetUserRepresentativeDocumentURLDTO, SearchUserDTO, UserSearchResultDTO } from '../../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../../Errors/UserError'
import FeedbackManager, { NOTIFICATION_TYPE } from './FeedbackManager'
import RoutingManager, { Page } from './RoutingManager'
import { ESUser } from '@newturn-develop/types-molink'

class SearchManager {
    _searchResults: ESUser[] = null
    isSearching = false
    searchText: string = null

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
        this.searchText = text
        const results = await UserAPI.searchUsers(new SearchUserDTO(text))
        this._searchResults = results
        this.isSearching = false
    }

    async moveBySearchResult (userId: number) {
        try {
            const { url } = await UserAPI.getUserRepresentativeDocumentUrl(new GetUserRepresentativeDocumentURLDTO(userId))
            RoutingManager.moveTo(Page.Index, url)
        } catch (err) {
            if (err instanceof UserNotExists) {
                FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '유저가 존재하지 않습니다.', '', 3)
            } else if (err instanceof RepresentativeDocumentNotExists) {
                FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '유저의 공개된 문서가 존재하지 않습니다.', '', 3)
            }
        }
    }
}
export default new SearchManager()
