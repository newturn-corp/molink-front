import React from 'react'
import { observer } from 'mobx-react'
import AuthManager from '../../manager/AuthManager'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

export const Header: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget)
      }

      const handleClose = (key: string) => {
          switch (key) {
          case 'sign-out':
              AuthManager.signOut()
          }
          setAnchorEl(null)
      }

      return <div className='header'>
          <img src="/header-logo.png" className='logo' />
          <div className='navigator'>
          </div>
          <div className='menu-container'>
              <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
              >
                  <MenuIcon />
              </IconButton>
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
                  <MenuItem key={'sign-out'} onClick={(event) => handleClose('sign-out')}>
                      {'로그아웃'}
                  </MenuItem>
              </Menu>
          </div>
      </div>
  })
