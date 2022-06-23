import { observer } from 'mobx-react'
import React from 'react'
import { FollowButton } from '../../global/FollowButton'
import { SettingProfileButton } from './SettingProfileButton'
import Blog from '../../../manager/global/Blog/Blog'

export const BlogUserInfoMain: React.FC<{}> = observer(() => {
    const name = Blog.profile.name
    return <div
        className={'main-container'}
    >
        <div
            className={'name'}
        >
            {name}
        </div>
        <FollowButton blogID={Blog.id}/>
        <SettingProfileButton/>
    </div>
})
