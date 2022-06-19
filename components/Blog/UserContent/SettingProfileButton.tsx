import { observer } from 'mobx-react'
import React from 'react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import UserManager from '../../../manager/global/User/UserManager'
import Blog from '../../../manager/global/Blog/Blog'

export const SettingProfileButton: React.FC<{
}> = observer(() => {
    if (!Blog.authority.setProfile) {
        return <></>
    }

    return <div
        className='profile-setting-button no-select'
        onClick={() => RoutingManager.moveTo(Page.SettingProfile)}
    >
        {'프로필 편집'}
    </div>
})
