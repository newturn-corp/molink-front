import { observer } from 'mobx-react'
import React from 'react'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import { getRelativeTime } from '../../../../utils/getRelativeTime'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const PageUserInfoComponent: React.FC<{
}> = observer(() => {
    const pageInfo = EditorPage.pageInfo
    const userInfo = EditorPage.userInfo
    return <div
        className={'page-user-info-container'}
    >
        <div
            className={'page-user-info'}
        >
            <div
                className={'user-info'}
                onClick={async () => {
                    await RoutingManager.moveTo(Page.Blog, `/${userInfo.nickname}`)
                }}
            >
                <Avatar
                    className='profile'
                    style={{
                        width: 30,
                        height: 30
                    }}
                    src={userInfo.userProfileImageUrl}
                />
                <div
                    className={'nickname'}
                >
                    {userInfo.nickname}
                </div>
            </div>
            <div
                className={'page-info'}
            >
                {getRelativeTime(new Date(pageInfo.lastEditedAt), {
                    showDate: true
                })}
            </div>
        </div>
    </div>
})
