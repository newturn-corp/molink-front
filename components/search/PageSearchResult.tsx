import { observer } from 'mobx-react'
import React from 'react'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import { ESPageSearchResult, ESUser } from '@newturn-develop/types-molink'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { FollowButton } from '../global/FollowButton'
import UserInfoMap from '../../manager/global/User/UserInfoMap'
import { Tag } from 'antd'
import { removeMaliciousHTML } from '../../utils/removeMalicousHTML'

export const PageSearchResult: React.FC<{
    result: ESPageSearchResult
}> = observer(({ result }) => {
    const userInfo = UserInfoMap.idMap[result.userId]
    return <ListItem
        alignItems="flex-start"
        className='page-search-result'
        onClick={async () => {
            await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${result.id}`)
        }}
    >
        <div
            className={'text-container'}
        >
            <div
                className={'title'}
                dangerouslySetInnerHTML={{
                    __html: result.title
                }}
            />
            <div
                className={'content'}
                dangerouslySetInnerHTML={{
                    __html: result.content
                }}
            />
            <div
                className={'search-tag-list-container'}
            >
                {
                    result.tags.length > 0 && result.tags.map((tag, index) =>
                        <Tag
                            key={`page-tag-${index}`}
                        >
                            {tag}
                        </Tag>)
                }
            </div>
            <div
                className={'user-container'}
                onClick={(event) => {
                    event.stopPropagation()
                    RoutingManager.moveTo(Page.Blog, `/${userInfo.nickname}`)
                }}
            >
                <img
                    className={'profile-image'}
                    src={userInfo.profileImageUrl}
                    width={20}
                />
                <div
                    className={'nickname'}
                >
                    {userInfo.nickname}
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
