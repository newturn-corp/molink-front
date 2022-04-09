import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import UserManager from '../../../../manager/global/User/UserManager'
import { BrowserView, isBrowser } from 'react-device-detect'

export const UserProfile: React.FC<{
  }> = observer(() => {
      const { isUserAuthorized } = UserManager

      const getUserNickname = () => {
          return isUserAuthorized ? UserManager.profile.nickname : '로그인'
      }

      return <>
          <Avatar
              className='profile'
              style={{
                  width: isBrowser ? 36 : 28,
                  height: isBrowser ? 36 : 28
              }}
              src={UserManager.profile.getUserProfileImageSrc()}
          />
          <BrowserView>
              <div
                  className='nickname'
                  style={{
                      color: isUserAuthorized ? '#2E639A' : '#454C53'
                  }}
              >
                  {getUserNickname()}
              </div>
          </BrowserView>
      </>
  })
