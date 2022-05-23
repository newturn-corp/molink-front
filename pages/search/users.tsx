import React, { useEffect } from 'react'
import { Header } from '../../components/global/Header/Header'
import { SearchCategory, SearchCategoryEnum } from '../../components/search/SearchCategory'
import SearchManager from '../../manager/global/SearchManager'
import { SearchResults } from '../../components/search/SearchResult'
import UserManager from '../../manager/global/User/UserManager'

const Search = () => {
    useEffect(() => {
        UserManager.load()
        const query = new URLSearchParams(window.location.search).get('q')
        SearchManager.search(query)
    }, [])

    return <div className='search-page' onClick={() => {
    } } >
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
