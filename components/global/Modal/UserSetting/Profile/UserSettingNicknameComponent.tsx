import React from 'react'
import { observer } from 'mobx-react'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import UserManager from '../../../../../manager/global/User/UserManager'
import { Avatar } from '@material-ui/core'
import { Input } from 'antd'
import Blog from '../../../../../manager/global/Blog/Blog'

export const UserSettingNicknameComponent: React.FC<{
}> = (props) => {
    return <div className='blog-name'>
        <p className='setting-name'>
            {'닉네임'}
        </p>
        <Input
            value={UserManager.profile.nickname}
            disabled={true}
            maxLength={20}
        />
    </div>
}
