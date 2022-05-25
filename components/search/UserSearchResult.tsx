import { observer } from 'mobx-react'
import React from 'react'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import { ESUser } from '@newturn-develop/types-molink'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { FollowButton } from '../global/FollowButton'

export const UserSearchResult: React.FC<{
    result: ESUser
}> = observer(({ result }) => {
    const profileImageSrc = result.profileImageUrl || undefined
    const profileInnerText = result.profileImageUrl ? undefined : result.nickname[0]
    const biography = result.biography === '' ? '소개가 없습니다.' : result.biography

    return <ListItem
        alignItems="flex-start"
        className='user-search-result'
        onClick={() => {
            RoutingManager.moveTo(Page.Blog, `/${result.nickname}`)
        }}
    >
        <ListItemAvatar>
            <Avatar
                className='avatar'
                sizes='40'
                src={profileImageSrc}
            >{profileInnerText}</Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={<React.Fragment>
                {result.nickname}
            </React.Fragment>}
            secondary={
                <React.Fragment>
                    {biography}
                </React.Fragment>
            }
        />
        <FollowButton userId={Number(result.id)}/>
    </ListItem>
})
