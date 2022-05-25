import { observer } from 'mobx-react'
import React from 'react'
import { FollowButton } from '../../global/FollowButton'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { SettingProfileButton } from './SettingProfileButton'

export const BlogUserInfoMain: React.FC<{
    userId: number,
    nickname: string
}> = observer(({ userId, nickname }) => {
    return <div
        className={'main-container'}
    >
        <div
            className={'nickname'}
        >
            {nickname}
        </div>
        <FollowButton userId={userId}/>
        <SettingProfileButton userId={userId}/>
    </div>
})
