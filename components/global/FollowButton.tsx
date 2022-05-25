import React, { useState } from 'react'
import { FollowStatus } from '@newturn-develop/types-molink'
import { observer } from 'mobx-react'
import UserManager from '../../manager/global/User/UserManager'
import { CircularProgress } from '@material-ui/core'
import LanguageManager from '../../manager/global/LanguageManager'

export const FollowButton: React.FC<{
    userId: number
}> = observer(({ userId }) => {
    const [isLoading, setIsLoading] = useState(false)
    if (!UserManager.isUserAuthorized || UserManager.userId === Number(userId)) {
        return <></>
    }

    const followStatus = UserManager.follow.checkUserFollowStatus(Number(userId))
    const handleFollowButtonClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (isLoading) {
            return
        }
        setIsLoading(true)
        await UserManager.follow.requestFollow(Number(userId))
        setIsLoading(false)
    }

    if (isLoading) {
        return <CircularProgress size={20} ></CircularProgress>
    }

    if (followStatus === FollowStatus.Following) {
        return <div className='follow-button requested no-select'>{LanguageManager.languageMap.Following}</div>
    } else if (followStatus === FollowStatus.FollowRequested) {
        return <div
            className='follow-button requested no-select'
        >{LanguageManager.languageMap.Requested}</div>
    } else if (followStatus === FollowStatus.Followed) {
        return <div
            className='follow-button'
            onClick={(event) => handleFollowButtonClick(event)}
        >{'맞팔로우'}</div>
    } else {
        return <div
            className='follow-button'
            onClick={(event) => handleFollowButtonClick(event)}
        >{LanguageManager.languageMap.Follow}</div>
    }
})
