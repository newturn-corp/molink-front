import { observer } from 'mobx-react'
import React from 'react'
import { BlogInfoProfile } from './UserContent/BlogInfoProfile'
import { BlogUserInfoMain } from './UserContent/BlogUserInfoMain'
import { BlogUserInfoFollowAndPage } from './UserContent/BlogUserInfoFollowAndPage'
import Blog from '../../manager/global/Blog/Blog'

export const BlogInfoComponent: React.FC<{}> = observer((dto) => {
    const biography = Blog.profile.biography
    return <>
        <div
            className={'blog-user-info'}
        >
            <BlogInfoProfile/>
            <div
                className={'text-container'}
            >
                <BlogUserInfoMain/>
                <BlogUserInfoFollowAndPage/>
                <div
                    className={'biography-container'}
                >
                    {!biography || biography === '' ? '소개가 없습니다.' : biography}
                </div>
            </div>
        </div>
    </>
})
