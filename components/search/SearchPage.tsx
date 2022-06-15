import React, { useEffect } from 'react'
import { Header } from '../../components/global/Header/Header'
import { SearchCategoryComponent } from '../../components/search/SearchCategoryComponent'
import SearchManager, { SearchCategory } from '../../manager/Search/SearchManager'
import UserManager from '../../manager/global/User/UserManager'
import { DefaultSiteHead } from '../../manager/global/DefaultSiteHead'
import { SearchPagination } from '../../components/search/SearchPagination'
import { SearchResultContainer } from '../../components/search/SearchResultContainer'
import { observer } from 'mobx-react'

export const SearchPageComponent: React.FC<{
    searchCategory: SearchCategory
    queryText: string,
    page: number
}> = observer(({
    searchCategory,
    queryText,
    page
}) => {
    useEffect(() => {
        UserManager.load()
        SearchManager.initSearchEngine(searchCategory)
        SearchManager.searchEngine.search(queryText, page)
        console.log('search 호출')
    }, [queryText, page, searchCategory])

    return <div
        className={'search-page'}
    >
        <DefaultSiteHead/>
        <Header />
        <div
            className={'index-body'}
            style={{
                height: '100%',
                overflowY: 'scroll'
            }}
        >
            <div className={'core'}>
                {
                    SearchManager.searchEngine && SearchManager.searchEngine.searchResults && <>
                        <SearchCategoryComponent
                            currentCategory={searchCategory}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: 100
                            }}
                        >
                            <SearchResultContainer
                                searchText={queryText}
                            />
                            <SearchPagination/>
                        </div>
                    </>
                }
            </div>
        </div>
    </div>
})
