import { observer } from 'mobx-react'
import React from 'react'
import { Button, ButtonGroup } from '@material-ui/core'
import SearchManager, { SearchCategory } from '../../manager/Search/SearchManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'

export enum SearchCategoryEnum {
    Blog = '블로그',
    User = '사용자',
    Content = '콘텐츠'
}

export interface SearchCategoryProps {
    currentCategory: SearchCategory
}

export interface SearchCategoryButtonProps {
    name: string
    onClick?: Function
    disabled?: boolean
}

export const SearchCategoryButton: React.FC<SearchCategoryButtonProps> = observer((props) => {
    return <Button
        disabled={props.disabled}
        style={{
            height: 48
        }}
        onClick={() => {
            if (!props.disabled && props.onClick) {
                props.onClick()
            }
        }}
    >{props.name}</Button>
})

export const SearchCategoryComponent: React.FC<SearchCategoryProps> = observer((props: SearchCategoryProps) => {
    const searchEngine = SearchManager.searchEngine
    return <div className='search-meta'>
        <ButtonGroup
            orientation="vertical"
            className='search-category'
            aria-label="vertical outlined primary button group"
        >
            <Button
                className={props.currentCategory === SearchCategory.Page ? 'selected-category' : undefined}
                onClick={() => {
                    if (props.currentCategory === SearchCategory.Page) {
                        return
                    }
                    RoutingManager.moveTo(Page.SearchPage, `?q=${searchEngine.searchText}&page=1`)
                }}
            >
                {'페이지'}
            </Button>
            <Button
                className={props.currentCategory === SearchCategory.User ? 'selected-category' : undefined}
                onClick={() => {
                    if (props.currentCategory === SearchCategory.User) {
                        return
                    }
                    RoutingManager.moveTo(Page.SearchUser, `?q=${searchEngine.searchText}&page=1`)
                }}
            >
                {'사용자'}
            </Button>
        </ButtonGroup>
    </div>
})
