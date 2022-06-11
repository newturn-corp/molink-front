import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { Input } from 'antd'
import { SettingCategory } from '../../components/setting/SettingCategory'
import UserManager from '../../manager/global/User/UserManager'
import LanguageManager from '../../manager/global/LanguageManager'
import { BiographySetting } from '../../components/setting/Profile/BiographySetting'
import SettingPageComponent from '../../components/setting/SettingPageComponent'
import { ProfileImageSetting } from '../../components/setting/Profile/ProfileImageSetting'

const SettingProfile = observer(() => {
    return <SettingPageComponent>
        <div className='profile'>
            <ProfileImageSetting/>
            <BiographySetting/>
        </div>
    </SettingPageComponent>
})

export default SettingProfile
