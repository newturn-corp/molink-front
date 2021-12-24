import React from 'react'
import { observer } from 'mobx-react'
import { Header } from '../components/global/Header/Header'
import { ButtonGroup, Button, List, Divider } from '@material-ui/core'
import { UserSearchResult } from '../components/search/UserSearchResult'
import SearchManager from '../manager/SearchManager'

const SearchResults: React.FC<{
    results: any
}> = ({ results }) => {
    return <List>
        {
            results.map(result => {
                return <>
                    <UserSearchResult key={Math.random()} nickname={result.nickname} />
                    <Divider variant="inset" component="li" />
                </>
            })
        }
    </List>
}

const Search = observer(() => {
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
                <div className='search-result'>
                    <List>
                        <SearchResults results={SearchManager.searchResults}/>
                    </List>
                </div>
            </div>
        </div>
    </div>
})

export default Search
