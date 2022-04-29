import React from 'react'
import { observer } from 'mobx-react'
import { Avatar, MenuItem } from '@material-ui/core'
import { Notification } from '../../../../domain/Notification'
import { getRelativeTime } from '../../../../utils/getRelativeTime'

export const NotificationBlock: React.FC<{
    notification: Notification,
  }> = observer(({ notification }) => {
      return <MenuItem>
          <div className='notification-block'>
              <div className='avatar-part'>
                  <Avatar className='img' sizes='32' src={notification.imgUrl}/>
              </div>
              <div>
                  <div className='view-part'>
                      <div className='msg-container'>
                          <div className='msg'>{notification.msg}</div>
                          <p className='createdAt'>{getRelativeTime(notification.createdAt)}</p>
                      </div>
                  </div>
              </div>
          </div>
      </MenuItem>
  })
