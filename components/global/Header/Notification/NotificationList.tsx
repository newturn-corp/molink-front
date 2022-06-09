import React from 'react'
import { observer } from 'mobx-react'
import { NotificationBlock } from './NotificationBlock'
import { FollowRequestComponent } from './FollowRequestComponent'
import UserManager from '../../../../manager/global/User/UserManager'

export const NotificationList: React.FC<{
}> = observer(() => {
    // 하나라도 isViewed가 false인 Notification이 있으면 보여줌
    const notifications = UserManager.notification.notifications
    const requestedFollows = UserManager.follow.requestedFollows
    const isNotificationExists = !!(requestedFollows.length + notifications.length)

    if (!isNotificationExists) {
        return <div className='notification-not-exists'>
            <div className='text'>
                알림이 존재하지 않습니다.
            </div>
        </div>
    }

    return <>
        {
            requestedFollows.length > 0 && <>
                <p className='label'>팔로우 요청</p>
                {
                    requestedFollows.map((req, index) => {
                        return <FollowRequestComponent
                            key={'follow-request-' + req.id}
                            followRequest={req}
                            index={index}
                        />
                    })
                }
            </>
        }
        {
            notifications.length > 0 && <>
                <div className='notification-label-container'>
                    <p className='label'>알림</p>
                    <div
                        className='check-all-notification-button'
                        onClick={() => UserManager.notification.setNotificationsCheckedAt()}
                    >모두 읽음</div>
                </div>
                {
                    notifications.map((noti, index) => {
                        return <NotificationBlock key={'notification-block-' + index} notification={noti}/>
                    })
                }
            </>
        }

    </>
})
