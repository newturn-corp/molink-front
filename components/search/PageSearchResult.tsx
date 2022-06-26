import { observer } from 'mobx-react'
import React from 'react'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import { ESPageSearchResult, ESUser } from '@newturn-develop/types-molink'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { FollowButton } from '../global/FollowButton'
import UserInfoMap from '../../manager/global/User/UserInfoMap'
import { Tag } from 'antd'
import { removeMaliciousHTML } from '../../utils/removeMalicousHTML'
import BlogInfoMap from '../../manager/global/Blog/BlogInfoMap'

export const PageSearchResult: React.FC<{
    result: ESPageSearchResult
}> = observer(({ result }) => {
    const blogInfo = BlogInfoMap.idMap[result.blogID]
    return <ListItem
        alignItems="flex-start"
        className='page-search-result'
        key={`page-search-result-container-${result.id}`}
        onClick={async () => {
            await RoutingManager.moveWithoutAddHistory(Page.Blog, `/blog-name/${result.id}/page-name`)
        }}
    >
        <div
            className={'text-container'}
            key={`page-search-result-text-container-${result.id}`}
        >
            <div
                className={'title'}
                key={`page-search-result-title-${result.id}`}
                dangerouslySetInnerHTML={{
                    __html: result.title
                }}
            />
            <div
                className={'content'}
                key={`page-search-result-content-${result.id}`}
                dangerouslySetInnerHTML={{
                    __html: result.content
                }}
            />
            <div
                className={'search-tag-list-container'}
                key={`page-search-result-tag-list-container-${result.id}`}
            >
                {
                    result.tags.length > 0 && result.tags.map((tag, index) =>
                        <Tag
                            key={`page-search-result-${result.id}-tag-${index}`}
                        >
                            {tag}
                        </Tag>)
                }
            </div>
            <div
                className={'user-container'}
                key={`page-search-result-user-container-${result.id}`}
                onClick={(event) => {
                    event.stopPropagation()
                    RoutingManager.moveTo(Page.Blog, `/${blogInfo.name}`)
                }}
            >
                <img
                    className={'profile-image'}
                    key={`page-search-result-profile-image-${result.id}`}
                    src={blogInfo.profileImageURL}
                    width={20}
                />
                <div
                    className={'nickname'}
                    key={`page-search-result-nickname-${result.id}`}
                >
                    {blogInfo.name}
                </div>
            </div>
        </div>
        <div
            className={'thumbnail'}
            style={{
                backgroundColor: result.image ? undefined : '#0094FF',
                padding: result.image ? undefined : 20
            }}
        >
            {
                result.image
                    ? <img
                        src={result.image}
                    />
                    : <div
                        className={'text'}
                    >
                        {removeMaliciousHTML(result.title)}
                    </div>
            }
        </div>
    </ListItem>
})
