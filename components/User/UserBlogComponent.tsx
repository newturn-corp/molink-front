import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from 'antd'
import { ESBlog } from '@newturn-develop/types-molink'
import { FollowButton } from '../global/FollowButton'

export const UserBlogComponent: React.FC<{
    blog: ESBlog
}> = observer((props) => {
    const biography = !props.blog.biography || props.blog.biography === '' ? '소개가 없습니다.' : props.blog.biography
    return <div
        className={'user-blog-component'}
    >
        <Avatar
            src={props.blog.profileImageURL}
            size={120}
        />
        <div
            className={'text-container'}
        >
            <div
                className={'blog-name'}
            >
                {props.blog.name}
            </div>
            <div
                className={'biography'}
            >
                {biography}
            </div>
        </div>
        <div
            className={'follow-button-container'}
        >
            <FollowButton
                blogID={Number(props.blog.id)}
            />
        </div>
    </div>
})
