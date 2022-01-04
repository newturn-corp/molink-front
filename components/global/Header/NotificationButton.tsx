import React, { useState } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/UserManager'
import { Menu, Badge, IconButton } from '@material-ui/core'
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined'
import { NotificationBlock } from './NotificationBlock'
import NotificationManager from '../../../manager/global/NotificationManager'
import FollowManager from '../../../manager/global/FollowManager'
import { FollowRequestComponent } from './FollowRequestComponent'
import { Notification } from '../../../domain/Notification'
import { FollowRequest } from '../../../domain/FollowRequest'

const FollowRequests: React.FC<{
    requests: FollowRequest[]
}> = observer(({ requests }) => {
    if (requests.filter(req => !req.isHandled).length === 0) {
        return <></>
    }
    return <>
        <p className='label'>팔로우 요청</p>
        {
            requests.map(req => {
                return <FollowRequestComponent key={'follow-request-' + req.id} followRequest={req}/>
            })
        }
    </>
})

const Notifications: React.FC<{
    notifications: Notification[]
}> = observer(({ notifications }) => {
    if (notifications.length === 0) {
        return <></>
    }
    return <>
        <div className='notification-label-container'>
            <p className='label'>알림</p>
            <div
                className='check-all-notification-button'
                onClick={() => NotificationManager.setNotificationsCheckedAt()}
            >모두 읽음</div>
        </div>
        {
            notifications.map(noti => {
                return <NotificationBlock key={'notification-block-' + noti.id} notification={noti}/>
            })
        }
    </>
})

export const NotificationButton: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)
      if (!UserManager.isUserAuthorized) {
          return <></>
      }
      // 하나라도 isViewed가 false인 Notification이 있으면 보여줌
      const notifications = NotificationManager.notifications
      const followRequests = FollowManager.followRequests.filter(req => !req.isHandled)
      const isNewNotification = (NotificationManager.notifications.filter(noti => !noti.isViewed).length + FollowManager.viewedFollowRequestsLength) > 0

      const isNotificationExists = !!(notifications.length + followRequests.length)

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
          FollowManager.checkFollowRequestsViewed()
          NotificationManager.checkNotificationsViewed()
      }

      const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
          if (event) {
              event.stopPropagation()
              event.preventDefault()
          }
          setAnchorEl(null)
      }

      return <div className='notification'>
          <Badge
              variant="dot"
              overlap={'circular'}
              onClick={(event) => handleClick(event)}
              invisible={!isNewNotification}
          >
              <IconButton
                  className={'button'}
                  aria-label="delete"
                  color="primary"
              >
                  <NotificationsOutlinedIcon/>
              </IconButton>
          </Badge>
          <Menu
              id="long-menu"
              className='notification-list'
              anchorEl={anchorEl}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
              }}
              keepMounted
              open={open}
              onClose={(event) => handleClose(null, null)}
              PaperProps={{
                  style: {
                      display: 'flex',
                      left: 'calc(100vw - 320px)',
                      right: '0px',
                      width: '360px',
                      top: '56px',
                      transformOrigin: 'unset'
                  }
              }}
              elevation={0}
              getContentAnchorEl={null}
          >
              {
                  isNotificationExists
                      ? <>
                          <FollowRequests requests={followRequests}/>
                          <Notifications notifications={notifications} />
                      </>
                      : <div className='notification-not-exists'>
                          <div className='text'>
                          알림이 존재하지 않습니다.
                          </div>
                      </div>
              }

          </Menu>
      </div>
  })
