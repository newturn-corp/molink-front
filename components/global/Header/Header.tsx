import React from 'react'
import { observer } from 'mobx-react'
import { Visibility } from './Visibility'
import { LoginButton } from './LoginButton'
import { NotificationButton } from './NotificationButton'
import { User } from './User'
import { SearchComponent } from './SearchComponent'
import RoutingManager, { Page } from '../../../manager/RoutingManager'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <div className='header-right'>
              <User/>
              <NotificationButton/>
              <Visibility />
              <LoginButton />
          </div>
          <div className='navigator'>
          </div>
          <SearchComponent />
          <div className='logo'>
              <img src="/header-logo.png" alt="" onClick={() => RoutingManager.moveTo(Page.Index)} />
          </div>
      </div>
  })
