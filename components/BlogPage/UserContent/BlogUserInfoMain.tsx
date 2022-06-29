import { observer } from 'mobx-react'
import React from 'react'
import { FollowButton } from '../../global/FollowButton'
import { SettingProfileButton } from './SettingProfileButton'
import Blog from '../../../manager/global/Blog/Blog'
import { BlogInfo } from '@newturn-develop/types-molink'

export const BlogUserInfoMain: React.FC<{
    blogID: number
    name: string
}> = observer((props) => {
    const { blogID, name } = props
    return <div
        className={'main-container'}
    >
        <div
            className={'name'}
        >
            {name}
        </div>
        <FollowButton
            blogID={blogID}
        />
        <SettingProfileButton
            blogID={blogID}
        />
    </div>
})
