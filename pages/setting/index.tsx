import React from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { ButtonGroup, Button, List, Divider } from '@material-ui/core'
import { UserSearchResult } from '../../components/search/UserSearchResult'
import SearchManager from '../../manager/SearchManager'
import UserManager from '../../manager/UserManager'
import RoutingManager, { Page } from '../../manager/RoutingManager'

const SearchResults: React.FC<{
    results: any
}> = ({ results }) => {
    return <List>
        {
            results.map(result => {
                return <>
                    <UserSearchResult key={Math.random()} nickname={result.nickname} id={result.id} />
                    <Divider variant="inset" component="li" />
                </>
            })
        }
    </List>
}

const Setting = observer(() => {
    if (!UserManager.isUserAuthorized) {
        RoutingManager.moveTo(Page.SignIn)
    }

    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <ButtonGroup
                        orientation="vertical"
                        className='search-buttons'
                        aria-label="vertical outlined primary button group"
                    >
                        <Button>프로필</Button>
                        <Button disabled={true}>문서</Button>
                    </ButtonGroup>
                </div>
                <div className='setting-list'>
                    <List>
                        <SearchResults results={SearchManager.searchResults}/>
                    </List>
                </div>
            </div>
        </div>
    </div>
})

export default Setting
