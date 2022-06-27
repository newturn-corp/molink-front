import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Avatar } from 'antd'
import Blog from '../../../manager/global/Blog/Blog'
import { BlogInfo } from '@newturn-develop/types-molink'

export const BlogInfoProfile: React.FC<{
    name: string
    profileImageURL: string
}> = observer((props) => {
    const { name, profileImageURL } = props
    return <div
        className={'profile-container'}
    >
        <Avatar
            className='profile-image'
            size={120}
            src={profileImageURL}
        >
            {profileImageURL ? null : name[0]}
        </Avatar>
    </div>
})
