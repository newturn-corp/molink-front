import { observer } from 'mobx-react'
import React from 'react'
import { BlogInfoProfile } from './UserContent/BlogInfoProfile'
import { BlogUserInfoMain } from './UserContent/BlogUserInfoMain'
import { BlogUserInfoFollowAndPage } from './UserContent/BlogUserInfoFollowAndPage'
import Blog from '../../manager/global/Blog/Blog'
import { BlogInfo } from '@newturn-develop/types-molink'
import { isBrowser } from 'react-device-detect'

export const BlogInfoComponent: React.FC<{
    blogID: number
    name: string
    profileImageURL: string
    biography: string
    followerCount: number
    pageCount?: number
}> = observer((props) => {
    const { blogID, name, profileImageURL, biography, followerCount, pageCount } = props
    return <>
        <div
            className={isBrowser ? 'blog-user-info' : 'mobile-blog-user-info'}
        >
            <BlogInfoProfile
                name={name}
                profileImageURL={profileImageURL}
            />
            <div
                className={'text-container'}
            >
                <BlogUserInfoMain
                    blogID={blogID}
                    name={name}
                />
                {
                    isBrowser && <>
                        <BlogUserInfoFollowAndPage
                            followerCount={followerCount}
                            pageCount={pageCount}
                        />
                        <div
                            className={'biography-container'}
                        >
                            {!biography || biography === '' ? '소개가 없습니다.' : biography}
                        </div>
                    </>
                }
            </div>
        </div>
    </>
})
