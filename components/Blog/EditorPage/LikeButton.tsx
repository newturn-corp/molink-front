import React from 'react'
import { observer } from 'mobx-react'
import PageManager from '../../../manager/Blog/PageManager'
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
