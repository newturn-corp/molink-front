import { observer } from 'mobx-react'
import React from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'

export const BlogUserInfoFollowAndPage: React.FC<{
    pageCount?: number,
    followerCount: number,
    followCount: number
}> = observer(({ pageCount, followerCount, followCount }) => {
    return <div
        className={'follow-info-container'}
    >
        {
            pageCount !== undefined
                ? <div className={'info'}>
                    <div className={'name'}>{LanguageManager.languageMap.Page}</div>
                    <div className={'text'}>{pageCount}</div>
                </div>
                : <></>
        }
        <div className={'info'}>
            <div className={'name'}>{LanguageManager.languageMap.Follower}</div>
            <div className={'text'}>{followerCount}</div>
        </div>
        <div className={'info'}>
            <div className={'name'}>{LanguageManager.languageMap.Follow}</div>
            <div className={'text'}>{followCount}</div>
        </div>
    </div>
})
