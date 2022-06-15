import { makeAutoObservable, toJS } from 'mobx'
import UserAPI from '../../api/UserAPI'
import { GetUserRepresentativeDocumentURLDTO, SearchUserDTO, UserSearchResultDTO } from '../../DTO/UserDTO'
import { RepresentativeDocumentNotExists, UserNotExists } from '../../Errors/UserError'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import { ESUser } from '@newturn-develop/types-molink'
import { UserSearchEngine } from './UserSearchEngine'
import { SearchEngine } from './SearchEngine'
import { PageSearchEngine } from './PageSearchEngine'

export enum SearchCategory {
    User = 'user',
    Page = 'page'
}

class SearchManager {
    searchEngine: SearchEngine = null
    currentCategory: SearchCategory = null

    constructor () {
        makeAutoObservable(this)
    }

    initSearchEngine (searchCategory: SearchCategory) {
        if (this.currentCategory === searchCategory) {
            return
        }
        console.log(searchCategory)
        this.currentCategory = searchCategory
        if (searchCategory === SearchCategory.User) {
            this.searchEngine = new UserSearchEngine()
        } else if (searchCategory === SearchCategory.Page) {
            this.searchEngine = new PageSearchEngine()
        }
    }
}
export default new SearchManager()
