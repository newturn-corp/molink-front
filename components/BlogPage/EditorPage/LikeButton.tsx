import React from 'react'
import { observer } from 'mobx-react'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const LikeButton: React.FC<{
}> = observer(() => {
    const pageInfo = EditorPage.pageInfo
    return <div
        className={'like-button'}
        onClick={() => pageInfo.handleLikeButtonDown()}
    >
        <div
            className={'icon' + (pageInfo.isLike ? ' filled' : '')}
        >
            {
                pageInfo.isLike
                    ? <HeartFilled/>
                    : <HeartOutlined/>
            }
        </div>
        <div className={'count'}>
            {`공감 ${pageInfo.likeCount}`}
        </div>
    </div>
})
