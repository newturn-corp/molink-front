import React, { useState } from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/UserManager'
import { Avatar, Menu, MenuItem, Badge } from '@material-ui/core'
import AuthManager from '../../../manager/AuthManager'
import { SupportModal } from '../SupportModal'
import SupportManager from '../../../manager/SupportManager'
import SaveManager, { ContentSaveStatus } from '../../../manager/SaveManager'
import RoutingManager, { Page } from '../../../manager/RoutingManager'

export const User: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)
      const profileImageSrc = UserManager.profileImageUrl ? UserManager.profileImageUrl : undefined
      const profileInnerText = UserManager.profileImageUrl ? undefined : UserManager.nickname[0]

      if (!UserManager.isUserAuthorized) {
          return <></>
      }

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
      }

      const handleClose = (key: string) => {
          switch (key) {
          case 'sign-out':
              AuthManager.signOut()
              break
          case 'support':
              SupportManager.showSupportModal = true
              break
          case 'setting':
              RoutingManager.moveTo(Page.SettingProfile)
          }
          setAnchorEl(null)
      }

      return <div className='user-container'>
          <Badge className={SaveManager.contentSaveStatus === ContentSaveStatus.SaveFailed ? 'disconnected' : 'connected' } variant="dot" overlap={'circular'}>
              <Avatar onClick={(event) => handleClick(event)} sizes='40' src={profileImageSrc}>{profileInnerText}</Avatar>
          </Badge>
          <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={(event) => handleClose(null)}
              PaperProps={{
                  style: {
                      maxHeight: 48 * 4.5,
                      width: '20ch'
                  }
              }}
          >
              <MenuItem key={'support'} onClick={(event) => handleClose('support')}>
                  {'문의 & 의견'}
              </MenuItem>
              <MenuItem key={'setting'} onClick={(event) => handleClose('setting')}>
                  {'설정'}
              </MenuItem>
              <MenuItem key={'sign-out'} onClick={(event) => handleClose('sign-out')}>
                  {'로그아웃'}
              </MenuItem>
          </Menu>
          <SupportModal/>
      </div>
  })