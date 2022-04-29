import React from 'react'
import { observer } from 'mobx-react'
import { Avatar, MenuItem } from '@material-ui/core'
import { getRelativeTime } from '../../../../utils/getRelativeTime'
import { FollowRequest } from '@newturn-develop/types-molink'

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
                          <div className='msg'><b>{followRequest.nickname}</b>님이 팔로우 요청을 보냈습니다.</div>
                          <p className='createdAt'>{getRelativeTime(followRequest.createdAt)}</p>
                      </div>
                  </div>
                  <div className='interaction'>
                      <div
                          className='button accept'
                          onClick={() => followRequest.accept()}
                      >확인</div>
                      <div
                          className='button reject'
                          onClick={() => followRequest.reject()}
                      >삭제</div>
                  </div>
              </div>
          </div>
      </MenuItem>
  })
