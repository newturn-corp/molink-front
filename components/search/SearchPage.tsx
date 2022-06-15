import React, { useEffect } from 'react'
import { Header } from '../../components/global/Header/Header'
import { SearchCategoryComponent } from '../../components/search/SearchCategoryComponent'
import SearchManager, { SearchCategory } from '../../manager/Search/SearchManager'
import UserManager from '../../manager/global/User/UserManager'
import { DefaultSiteHead } from '../../manager/global/DefaultSiteHead'
import { SearchPagination } from '../../components/search/SearchPagination'
import { SearchResultContainer } from '../../components/search/SearchResultContainer'

export const SearchPageComponent: React.FC<{ searchCategory: SearchCategory }> = ({ searchCategory }) => {
    const url = new URLSearchParams(window.location.search)
    const queryText = url.get('q')
    const page = Number(url.get('page') || 1)

    useEffect(() => {
        UserManager.load()
        SearchManager.initSearchEngine(searchCategory)
        SearchManager.searchEngine.search(queryText, page)
    }, [queryText, page])

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
                    SearchManager.searchEngine && <>
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
}
