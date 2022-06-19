import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Avatar } from 'antd'
import Blog from '../../../manager/global/Blog/Blog'

export const BlogInfoProfile: React.FC<{
}> = observer(() => {
    const { name, profileImageURL } = Blog.profile
    return <div
        className={'profile-container'}
    >
        <Avatar
            className='profile-image'
            size={200}
            src={profileImageURL}
        >
            {profileImageURL ? null : name[0]}
        </Avatar>
    </div>
})
