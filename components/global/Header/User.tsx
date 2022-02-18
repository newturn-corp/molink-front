import React, { useState } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/global/UserManager'
import { Avatar, Menu, MenuItem, Badge } from '@material-ui/core'
import AuthManager from '../../../manager/Auth/AuthManager'
import { SupportModal } from '../SupportModal'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import SupportManager from '../../../manager/global/SupportManager'

export const User: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

      if (!UserManager.isUserAuthorized || !UserManager.profile) {
          return <></>
      }

      const open = Boolean(anchorEl)
      const profileImageSrc = UserManager.profile.profileImageUrl || undefined
      const profileInnerText = UserManager.profile.profileImageUrl ? undefined : UserManager.profile.nickname[0]

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

      return <div>
          <div className='user-container' onClick={(event) => handleClick(event)}>
              <Badge className={'connected'} variant="dot" overlap={'circular'}>
                  <Avatar className='profile' sizes='32' src={profileImageSrc}>{profileInnerText}</Avatar>
              </Badge>
              <div className='nickname'>
                  {UserManager.profile.nickname}
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
      </div>
  })
