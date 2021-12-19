import React from 'react'
import { observer } from 'mobx-react'
import AuthManager from '../../../manager/AuthManager'
import { CircularProgress, IconButton, Menu, MenuItem } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { MenuComponent } from './Menu'
import { NetworkStatus } from './NetworkStatus'

export const Header: React.FC<{
  }> = observer(() => {
      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)

      return <div className='header'>
          <img src="/header-logo.png" className='logo' />
          <div className='navigator'>
          </div>
          <NetworkStatus />
          <MenuComponent/>
      </div>
  })
