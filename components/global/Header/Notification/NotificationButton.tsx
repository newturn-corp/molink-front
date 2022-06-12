import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Menu, Badge, IconButton } from '@material-ui/core'
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined'
import UserManager from '../../../../manager/global/User/UserManager'
import { NotificationList } from './NotificationList'

export const NotificationButton: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)
      if (!UserManager.isUserAuthorized) {
          return <></>
      }
      // 하나라도 isViewed가 false인 Notification이 있으면 보여줌
      const isNewNotificationExists = UserManager.follow.isNewRequestedFollowExist || UserManager.notification.notifications.filter(noti => !noti.isViewed).length > 0

      const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
          await UserManager.follow.checkFollowRequestsViewed()
          await UserManager.notification.checkNotificationsViewed()
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
              invisible={!isNewNotificationExists}
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
              <div>
                  <NotificationList/>
              </div>
          </Menu>
      </div>
  })
