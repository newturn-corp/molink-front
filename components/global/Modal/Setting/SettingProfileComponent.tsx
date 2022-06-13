import React from 'react'
import { observer } from 'mobx-react'
import { ProfileImageSetting } from './Profile/ProfileImageSetting'
import { BiographySetting } from './Profile/BiographySetting'

export const SettingProfileComponent: React.FC<{
}> = observer(() => {
    return <>
        <ProfileImageSetting/>
        <BiographySetting/>
    </>
})
