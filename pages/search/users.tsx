import React from 'react'
import { SearchCategory } from '../../manager/Search/SearchManager'
import { SearchPageComponent } from '../../components/search/SearchPage'

const UserSearchPageComponent = () => {
    return <SearchPageComponent
        searchCategory={SearchCategory.User}
    />
}

export default UserSearchPageComponent
