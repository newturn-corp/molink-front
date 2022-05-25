import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Avatar } from '@material-ui/core'

export const BlogUserInfoProfile: React.FC<{
    profileImageUrl: string
}> = observer(({ profileImageUrl }) => {
    return <div
        className={'profile-container'}
    >
        <Avatar
            className='profile-image'
            sizes='200'
            src={profileImageUrl}
        />
    </div>
})
