import { observer } from 'mobx-react'
import React from 'react'
import PageManager from '../../../../manager/Blog/PageManager'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import { getRelativeTime } from '../../../../utils/getRelativeTime'

export const PageUserInfoComponent: React.FC<{
}> = observer(() => {
    return <div
        className={'page-user-info-container'}
    >
        <div
            className={'page-user-info'}
        >
            <div
                className={'user-info'}
                onClick={async () => {
                    await RoutingManager.moveTo(Page.Blog, `/${PageManager.pageUserInfo.nickname}`)
                }}
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
                >
                    {PageManager.pageUserInfo.nickname}
                </div>
            </div>
            <div
                className={'page-info'}
            >
                {getRelativeTime(new Date(PageManager.pageUserInfo.lastEditedAt), true)}
            </div>
        </div>
        <div className={'divider'}></div>
    </div>
})
