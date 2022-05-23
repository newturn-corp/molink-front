import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { Avatar, CircularProgress, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import SearchManager from '../../manager/global/SearchManager'
import UserManager from '../../manager/global/User/UserManager'
import { ESUser } from '@newturn-develop/types-molink'
import { FollowStatus } from '../../manager/global/User/UserFollow'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import LanguageManager from '../../manager/global/LanguageManager'

const FollowButton: React.FC<{
    searchResult: ESUser
}> = observer(({ searchResult }) => {
    const [isLoading, setIsLoading] = useState(false)
    if (!UserManager.isUserAuthorized || UserManager.userId === Number(searchResult.id)) {
        return <></>
    }

    const followStatus = UserManager.follow.checkUserFollowStatus(Number(searchResult.id))
    const handleFollowButtonClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (isLoading) {
            return
        }
        setIsLoading(true)
        await UserManager.follow.requestFollow(Number(searchResult.id))
        setIsLoading(false)
    }

    if (isLoading) {
        return <CircularProgress size={20} ></CircularProgress>
    }

    if (followStatus === FollowStatus.Following) {
        return <div className='follow-button requested no-select'>{LanguageManager.languageMap.Following}</div>
    } else if (followStatus === FollowStatus.FollowRequested) {
        console.log('여기 호출!!!')
        return <div className='follow-button requested no-select'>{LanguageManager.languageMap.Requested}</div>
    } else {
        return <div
            className='follow-button'
            onClick={(event) => handleFollowButtonClick(event)}
        >{LanguageManager.languageMap.Follow}</div>
    }
})

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
        <FollowButton searchResult={result}></FollowButton>
    </ListItem>
})
