import React from 'react'
import { observer } from 'mobx-react'
import { ProfileImageSetting } from '../../../setting/Profile/ProfileImageSetting'
import { BiographySetting } from '../../../setting/Profile/BiographySetting'

export const SettingProfileComponent: React.FC<{
}> = observer(() => {
    return <>
        <ProfileImageSetting/>
        <BiographySetting/>
    </>
})
