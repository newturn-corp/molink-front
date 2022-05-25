import { observer } from 'mobx-react'
import React from 'react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import UserManager from '../../../manager/global/User/UserManager'

export const SettingProfileButton: React.FC<{
    userId: number
}> = observer(({ userId }) => {
    if (!UserManager.isUserAuthorized || UserManager.userId !== Number(userId)) {
        return <></>
    }
    return <div
        className='profile-setting-button no-select'
        onClick={() => RoutingManager.moveTo(Page.SettingProfile)}
    >{'프로필 편집'}</div>
})
