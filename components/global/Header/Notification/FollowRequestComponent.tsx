import React from 'react'
import { observer } from 'mobx-react'
import { Avatar, MenuItem } from '@material-ui/core'
import { getRelativeTime } from '../../../../utils/getRelativeTime'
import { FollowRequest } from '@newturn-develop/types-molink'
import LanguageManager from '../../../../manager/global/LanguageManager'

export const FollowRequestComponent: React.FC<{
    followRequest: FollowRequest,
  }> = observer(({ followRequest }) => {
      if (followRequest.isHandled) {
          return <></>
      }

      return <MenuItem>
          <div className='notification-block'>
              <div className='avatar-part'>
                  <Avatar className='img' sizes='32' src={followRequest.profileImgUrl}/>
              </div>
              <div>
                  <div className='view-part'>
                      <div className='msg-container'>
                          <div className='msg'><b>{followRequest.nickname}</b>{LanguageManager.languageMap.FollowRequestText}</div>
                          <p className='createdAt'>{getRelativeTime(followRequest.createdAt)}</p>
                      </div>
                  </div>
                  <div className='interaction'>
                      <div
                          className='button accept'
                      >{LanguageManager.languageMap.Accept}</div>
                      <div
                          className='button reject'
                      >{LanguageManager.languageMap.Delete}</div>
                  </div>
              </div>
          </div>
      </MenuItem>
  })
