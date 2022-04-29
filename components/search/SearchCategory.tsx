import { observer } from 'mobx-react'
import React from 'react'
import { Button, ButtonGroup, Divider, List } from '@material-ui/core'

export enum SearchCategoryEnum {
    Blog = '블로그',
    User = '사용자',
    Content = '콘텐츠'
}

export interface SearchCategoryProps {
    currentCategory: SearchCategoryEnum
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

export const SearchCategory: React.FC<SearchCategoryProps> = observer((props: SearchCategoryProps) => {
    return <div className='search-meta'>
        <ButtonGroup
            orientation="vertical"
            className='search-category'
            aria-label="vertical outlined primary button group"
        >
            <Button>
                {'사용자'}
            </Button>
            <Button
                disabled={true}
            >
                {'하이어라키'}
            </Button>
            <Button
                disabled={true}
            >
                {'콘텐츠'}
            </Button>
        </ButtonGroup>
    </div>
})
