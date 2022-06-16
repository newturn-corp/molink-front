import React from 'react'
import { SearchCategory } from '../../manager/Search/SearchManager'
import { SearchPageComponent } from '../../components/search/SearchPage'

const PageSearchPageComponent = () => {
    if (typeof window === 'undefined' || !window) {
        return <></>
    }
    const url = new URLSearchParams(window.location.search)
    const queryText = url.get('q')
    const page = Number(url.get('page') || 1)
    return <SearchPageComponent
        searchCategory={SearchCategory.Page}
        queryText={queryText}
        page={page}
    />
}

export default PageSearchPageComponent
