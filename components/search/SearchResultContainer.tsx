import { observer } from 'mobx-react'
import React from 'react'
import { Divider } from '@material-ui/core'
import SearchManager, { SearchCategory } from '../../manager/Search/SearchManager'
import { UserSearchResult } from './UserSearchResult'
import LanguageManager from '../../manager/global/LanguageManager'
import { PageSearchResult } from './PageSearchResult'

export const SearchResultContainer: React.FC<{
    searchText: string
}> = observer((props) => {
    const searchEngine = SearchManager.searchEngine
    const searchResults = searchEngine.searchResults
    if (!searchResults) {
        return <></>
    }

    return <div className='search-result'>
        <div
            className={'search-text'}
        >
            {`"${props.searchText}"${LanguageManager.languageMap.For}`}
        </div>
        <div
            className={'search-result-count'}
        >
            {`${searchResults.length}${SearchManager.currentCategory === SearchCategory.User ? LanguageManager.languageMap.UserSearchResultCount : LanguageManager.languageMap.PageSearchResultCount}`}
        </div>
        <div
            className={'count-divider'}
        />
        {
            searchResults.length > 0
                ? <>
                    {
                        searchResults.map((result, index) => {
                            return <>
                                {
                                    SearchManager.currentCategory === SearchCategory.User
                                        ? <UserSearchResult
                                            key={`user-search-result-${result.id}`}
                                            result={result}
                                        />
                                        : SearchManager.currentCategory === SearchCategory.Page
                                            ? <PageSearchResult
                                                key={`page-search-result-${result.id}`}
                                                result={result}
                                            />
                                            : <></>
                                }
                                {
                                    index !== searchEngine.searchResults.length - 1 && <Divider
                                        key={`search-divider-${result.id}`}
                                    />
                                }
                            </>
                        })
                    }
                </>
                : <div>
                    {LanguageManager.languageMap.NoSearchResult}
                </div>
        }
    </div>
})
