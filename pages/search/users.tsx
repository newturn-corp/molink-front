import React, { useEffect } from 'react'
import { Header } from '../../components/global/Header/Header'
import { SearchCategory, SearchCategoryEnum } from '../../components/search/SearchCategory'
import SearchManager from '../../manager/global/SearchManager'
import { SearchResults } from '../../components/search/SearchResult'
import UserManager from '../../manager/global/User/UserManager'
import { SiteHead } from '../../components/global/SiteHead'

const Search = () => {
    const query = new URLSearchParams(window.location.search).get('q')

    useEffect(() => {
        UserManager.load()
        SearchManager.search(query)
    }, [query])

    return <div className='search-page' onClick={() => {
    } } >
        <SiteHead/>
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <SearchCategory
                    currentCategory={SearchCategoryEnum.User}
                />
                <SearchResults/>
            </div>
        </div>
    </div>
}

export default Search
