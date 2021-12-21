import React from 'react'
import { observer } from 'mobx-react'
import { MenuComponent } from './Menu'
import { NetworkStatus } from './NetworkStatus'
import { Visibility } from './Visibility'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <MenuComponent/>
          <NetworkStatus />
          <Visibility />
          <div className='navigator'>
          </div>
      </div>
  })
