import { observer } from 'mobx-react'
import React from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'
import Blog from '../../../manager/global/Blog/Blog'

export const BlogUserInfoFollowAndPage: React.FC<{
    followerCount: number,
    pageCount?: number
}> = observer((props) => {
    const { followerCount, pageCount } = props
    return <div
        className={'follow-info-container'}
    >
        {
            pageCount !== undefined &&
            <div className={'info'}>
                <div className={'name'}>{LanguageManager.languageMap.Page}</div>
                <div className={'text'}>{pageCount}</div>
            </div>
        }
        <div className={'info'}>
            <div className={'name'}>{LanguageManager.languageMap.Follower}</div>
            <div className={'text'}>{followerCount}</div>
        </div>
    </div>
})
