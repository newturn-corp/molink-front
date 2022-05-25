import { observer } from 'mobx-react'
import React from 'react'

export const BlogUserInfoFollowAndPage: React.FC<{
    pageCount: number,
    followerCount: number,
    followCount: number
}> = observer(({ pageCount, followerCount, followCount }) => {
    return <div
        className={'follow-info-container'}
    >
        <div className={'info'}>
            <div className={'name'}>{'페이지'}</div>
            <div className={'text'}>{pageCount}</div>
        </div>
        <div className={'info'}>
            <div className={'name'}>{'팔로워'}</div>
            <div className={'text'}>{followerCount}</div>
        </div>
        <div className={'info'}>
            <div className={'name'}>{'팔로우'}</div>
            <div className={'text'}>{followCount}</div>
        </div>
    </div>
})
