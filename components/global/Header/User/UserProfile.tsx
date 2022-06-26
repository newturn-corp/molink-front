import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from 'antd'
import UserManager from '../../../../manager/global/User/UserManager'
import { BrowserView, isBrowser } from 'react-device-detect'
import LanguageManager from '../../../../manager/global/LanguageManager'

export const UserProfile: React.FC<{
  }> = observer(() => {
      const { isUserAuthorized } = UserManager

      const getUserNickname = () => {
          return isUserAuthorized ? UserManager.profile.nickname : LanguageManager.languageMap.SignIn
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
