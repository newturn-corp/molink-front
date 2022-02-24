import React, { useState } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/global/UserManager'
import { Avatar, Menu, MenuItem, Badge } from '@material-ui/core'
import AuthManager from '../../../manager/Auth/AuthManager'
import { SupportModal } from '../SupportModal'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import SupportManager from '../../../manager/global/SupportManager'
import NewUserManager from '../../../manager/global/NewUserManager'
import Identicon from 'identicon.js'
import crypto from 'crypto'

export const User: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

      if (!NewUserManager.isUserAuthorized || !NewUserManager.profile) {
          return <></>
      }

      const open = Boolean(anchorEl)
      const profileImageSrc = NewUserManager.profile.profileImageUrl || `data:image/png;base64,${
          new Identicon(
              crypto.createHash('sha512')
                  .update(NewUserManager.profile.nickname)
                  .digest('base64'), {
                  size: 64,
                  foreground: [58, 123, 191, 255]
              }).toString()}`
      // const profileInnerText = NewUserManager.profile.profileImageUrl ? undefined : NewUserManager.profile.nickname[0]

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
      }

      const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
          if (event) {
              event.stopPropagation()
              event.preventDefault()
          }

          switch (key) {
          case 'sign-out':
              AuthManager.signOut()
              break
          case 'support':
              SupportManager.showSupportModal = true
              break
          case 'setting':
              RoutingManager.moveTo(Page.SettingProfile)
              break
          }
          setAnchorEl(null)
      }

      return <>
          <div className='user-container' onClick={(event) => handleClick(event)}>
              <Avatar className='profile' sizes='32' src={profileImageSrc}>
                  {/* {profileInnerText} */}
              </Avatar>
              <div className='nickname'>
                  {NewUserManager.profile.nickname}
              </div>
          </div>
          <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={(event) => handleClose(null, null)}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
              }}
              PaperProps={{
                  style: {
                      maxHeight: 48 * 4.5,
                      width: '20ch'
                  }
              }}
          >
              <MenuItem key={'support'} onClick={(event) => handleClose(event, 'support')}>
                  {'문의 & 의견'}
              </MenuItem>
              <MenuItem key={'setting'} onClick={(event) => handleClose(event, 'setting')}>
                  {'설정'}
              </MenuItem>
              <MenuItem key={'sign-out'} onClick={(event) => handleClose(event, 'sign-out')}>
                  {'로그아웃'}
              </MenuItem>
          </Menu>
          <SupportModal/>
      </>
  })
