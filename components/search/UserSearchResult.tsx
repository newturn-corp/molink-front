import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core'
import SearchManager from '../../manager/SearchManager'
import { FollowResult, UserSearchResultDTO } from '../../DTO/UserDTO'
import UserManager from '../../manager/UserManager'

export const UserSearchResult: React.FC<{
    result: UserSearchResultDTO
}> = observer(({ result }) => {
    const profileImageSrc = result.profileImageUrl || undefined
    const profileInnerText = result.profileImageUrl ? undefined : result.nickname[0]
    const [followResult, setFollowResult] = useState(null)

    const handleClick = () => {
        SearchManager.moveBySearchResult(result.id)
    }

    const handleFollowButtonClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        setFollowResult(await UserManager.follow(result.id))
    }

    return <ListItem alignItems="flex-start" className='user-search-result' onClick={() => handleClick()}>
        <ListItemAvatar>
            <Avatar sizes='40' src={profileImageSrc}>{profileInnerText}</Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={result.nickname}
            secondary={
                <React.Fragment>
                    {result.biography}
                </React.Fragment>
            }
        />
        {/* {
            UserManager.userId !== result.id && !result.isFollowing
                ? <div className='follow-button'>Follow</div>
                : <></>
        } */}
        {
            followResult === null
                ? <div className='follow-button' onClick={(event) => handleFollowButtonClick(event)}>Follow</div>
                : followResult === FollowResult.Succeeded
                    ? <div className='follow-button'>팔로잉</div>
                    : <div className='follow-button'>요청 완료</div>
        }
    </ListItem>
})
