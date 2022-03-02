import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import UserManager from '../../../../manager/global/User/UserManager'

export const UserProfile: React.FC<{
  }> = observer(() => {
      const { isUserAuthorized } = UserManager

      const getUserProfileImageSrc = () => {
          if (!isUserAuthorized) {
              return '/image/global/header/login-button-profile.png'
          }
          return UserManager.profile.profileImageUrl || `data:image/png;base64,${
              new Identicon(
                  crypto.createHash('sha512')
                      .update(UserManager.profile.nickname)
                      .digest('base64'), {
                      size: 64,
                      foreground: [58, 123, 191, 255]
                  }).toString()}`
      }

      const getUserNickname = () => {
          return isUserAuthorized ? UserManager.profile.nickname : '로그인'
      }

      return <>
          <Avatar
              className='profile'
              sizes='32'
              src={getUserProfileImageSrc()}
          />
          <div
              className='nickname'
              style={{
                  color: isUserAuthorized ? '#2E639A' : '#454C53'
              }}
          >
              {getUserNickname()}
          </div>
      </>
  })
