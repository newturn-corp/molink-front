import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import BlogManager from '../../../../manager/Blog/BlogManager'
import { PageColumnComponent } from '../../../global/PageColumnComponent'
import { ESUser } from '@newturn-develop/types-molink'
import moment from 'moment-timezone'
import { Pagination } from '@material-ui/lab'
import PageManager from '../../../../manager/Blog/PageManager'
import { isBrowser } from 'react-device-detect'
import UserManager from '../../../../manager/global/User/UserManager'
import { Avatar } from '@material-ui/core'

export const PageUserInfoComponent: React.FC<{
}> = observer(() => {
    return <div
        className={'page-user-info-container'}
    >
        <div
            className={'page-user-info'}
        >
            <Avatar
                className='profile'
                style={{
                    width: 30,
                    height: 30
                }}
                src={PageManager.pageUserInfo.userProfileImageUrl}
            />
            <div
                className={'nickname'}
            >{PageManager.pageUserInfo.nickname}</div>
        </div>
        <div className={'divider'}></div>
    </div>
})
