import React from 'react'
import { observer } from 'mobx-react'
import { NotificationButton } from './NotificationButton'
import { User } from './User'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <div className='header-right'>
              <User/>
              {/* <NotificationButton/> */}
          </div>
          <div className='navigator'>
          </div>
          {/* <SearchComponent /> */}
          <div className='logo'>
              <img src="/image/global/header/logo.png" alt="" onClick={() => RoutingManager.moveTo(Page.Index)} />
          </div>
      </div>
  })
