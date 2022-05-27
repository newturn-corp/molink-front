import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import BlogPage from '../../manager/Blog/BlogPage'
import { Avatar } from '@material-ui/core'
import { FollowButton } from '../global/FollowButton'
import { BlogUserInfoProfile } from './UserContent/BlogUserInfoProfile'
import { BlogUserInfoMain } from './UserContent/BlogUserInfoMain'
import { BlogUserInfoFollowAndPage } from './UserContent/BlogUserInfoFollowAndPage'

export interface BlogUserInfoInterface {
    userId: number,
    nickname: string,
    profileImageUrl: string,
    biography: string,
    followerCount: number,
    followCount: number
    pageCount?: number
}

export const BlogUserInfoComponent: React.FC<BlogUserInfoInterface> = observer((dto) => {
    const {
        userId,
        nickname,
        profileImageUrl,
        biography,
        followerCount,
        followCount,
        pageCount
    } = dto
    return <>
        <div
            className={'blog-user-info'}
        >
            <BlogUserInfoProfile profileImageUrl={profileImageUrl}/>
            <div
                className={'text-container'}
            >
                <BlogUserInfoMain userId={userId} nickname={nickname}/>
                <BlogUserInfoFollowAndPage pageCount={pageCount} followerCount={followerCount} followCount={followCount}/>
                <div
                    className={'biography-container'}
                >
                    {biography === '' ? '소개가 없습니다.' : biography}
                </div>
            </div>
        </div>
    </>
})
