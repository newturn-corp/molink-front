import { observer } from 'mobx-react'
import React from 'react'
import PageManager from '../../../../manager/Blog/PageManager'
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
