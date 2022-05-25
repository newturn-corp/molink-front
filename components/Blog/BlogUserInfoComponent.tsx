import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import BlogPage from '../../manager/Blog/BlogPage'
import { Avatar } from '@material-ui/core'
import { FollowButton } from '../global/FollowButton'
import { BlogUserInfoProfile } from './UserContent/BlogUserInfoProfile'
import { BlogUserInfoMain } from './UserContent/BlogUserInfoMain'
import { BlogUserInfoFollowAndPage } from './UserContent/BlogUserInfoFollowAndPage'

export const BlogUserInfoComponent: React.FC<{
}> = observer(() => {
    const blog = BlogPage.blog
    if (!blog) {
        return <></>
    }
    const blogUserInfo = BlogPage.blog.blogUserInfo
    const {
        userId,
        nickname,
        profileImageUrl,
        biography,
        followerCount,
        followCount
    } = blogUserInfo
    const pageCount = BlogPage.blog.userPageList.totalPageCount
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
