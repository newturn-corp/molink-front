import React from 'react'
import { Header } from '../components/global/Header/Header'
import { ButtonGroup, Button } from '@material-ui/core'
import SearchManager from '../manager/SearchManager'
import UserManager from '../manager/UserManager'
import GlobalManager from '../manager/GlobalManager'
import { SearchResults } from '../components/search/SearchResult'

const Search = () => {
    UserManager.updateUserProfile()
        .then(() => {
            const window = globalThis.window || GlobalManager.window
            const query = new URLSearchParams(window.location.search).get('q')
            SearchManager.search(query)
        })

    return <div className='search-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='search-meta'>
                    <ButtonGroup
                        orientation="vertical"
                        className='search-buttons'
                        aria-label="vertical outlined primary button group"
                    >
                        <Button>사용자</Button>
                        <Button disabled={true}>문서</Button>
                    </ButtonGroup>
                </div>
                <SearchResults/>
            </div>
        </div>
    </div>
}

export default Search
