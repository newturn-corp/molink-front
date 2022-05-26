import React, { useState } from 'react'
import { FollowStatus } from '@newturn-develop/types-molink'
import { observer } from 'mobx-react'
import UserManager from '../../manager/global/User/UserManager'
import { CircularProgress } from '@material-ui/core'
import LanguageManager from '../../manager/global/LanguageManager'
import PageManager from '../../manager/Blog/PageManager'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'

export const LikeButton: React.FC<{
}> = observer(() => {
    return <div
        className={'like-button'}
        onClick={() => PageManager.pageUserInfo.handleLikeButtonDown()}
    >
        <div
            className={'icon' + (PageManager.pageUserInfo.isLike ? ' filled' : '')}
        >
            {
                PageManager.pageUserInfo.isLike
                    ? <HeartFilled/>
                    : <HeartOutlined/>
            }
        </div>
        <div className={'count'}>
            {`공감 ${PageManager.pageUserInfo.likeCount}`}
        </div>
    </div>
})
