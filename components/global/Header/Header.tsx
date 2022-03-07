import React from 'react'
import { observer } from 'mobx-react'
import { UserContainer } from './User/UserContainer'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { SettingModal } from '../Setting/SettingModal'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <div className='header-right'>
              <UserContainer/>
              {/* <NotificationButton/> */}
          </div>
          <div className='navigator'>
          </div>
          {/* <SearchComponent /> */}
          <div className='logo'>
              <img src="/image/global/header/logo.png" alt="" onClick={() => RoutingManager.moveTo(Page.Index)} />
          </div>
          <SettingModal/>
      </div>
  })
