import React from 'react'
import { observer } from 'mobx-react'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import UserManager from '../../../../../manager/global/User/UserManager'
import { Avatar } from '@material-ui/core'
import { Input } from 'antd'
import Blog from '../../../../../manager/global/Blog/Blog'

export const BlogNameSettingComponent: React.FC<{
}> = (props) => {
    return <div className='blog-name'>
        <p className='setting-name'>
            {'블로그 이름'}
        </p>
        <Input
            value={Blog.profile.name}
            disabled={true}
            maxLength={20}
        />
    </div>
}
