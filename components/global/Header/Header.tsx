import React from 'react'
import { observer } from 'mobx-react'
import { MenuComponent } from './Menu'
import { NetworkStatus } from './NetworkStatus'
import { Visibility } from './Visibility'
import { LoginButton } from './LoginButton'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <MenuComponent/>
          <NetworkStatus />
          <Visibility />
          <LoginButton />
          <div className='navigator'>
          </div>
      </div>
  })
