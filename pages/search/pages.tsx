import React from 'react'
import { SearchCategory } from '../../manager/Search/SearchManager'
import { SearchPageComponent } from '../../components/search/SearchPage'

const PageSearchPageComponent = () => {
    return <SearchPageComponent
        searchCategory={SearchCategory.Page}
    />
}

export default PageSearchPageComponent
