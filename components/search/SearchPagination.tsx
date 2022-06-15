import React from 'react'
import SearchManager, { SearchCategory } from '../../manager/Search/SearchManager'
import { Pagination } from '@material-ui/lab'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'

export const SearchPagination: React.FC<{
}> = observer(() => {
    const searchEngine = SearchManager.searchEngine
    return <div
        className={'pagination'}
    >
        <Pagination
            count={Math.ceil(searchEngine.total / searchEngine.searchResultCountPerPage)}
            page={searchEngine.page}
            onChange={async (event, newOrder) => {
                await RoutingManager.moveTo(SearchManager.currentCategory === SearchCategory.Page ? Page.SearchPage : Page.SearchUser, `?q=${searchEngine.searchText}&page=${newOrder}`)
            }}
            showFirstButton
            showLastButton
        />
    </div>
})
