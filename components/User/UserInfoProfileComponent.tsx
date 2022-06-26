import { observer } from 'mobx-react'
import React from 'react'
import { Avatar } from 'antd'
import UserPage from '../../manager/User/UserPage'

export const UserInfoProfileComponent: React.FC<{
}> = observer(() => {
    const { nickname, profileImageUrl } = UserPage.info

    return <div
        className={'profile-container'}
    >
        <Avatar
            className='profile-image'
            size={120}
            src={profileImageUrl}
        >
            {profileImageUrl ? null : nickname[0]}
        </Avatar>
    </div>
})
