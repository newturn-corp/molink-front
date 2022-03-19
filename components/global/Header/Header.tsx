import React from 'react'
import { observer } from 'mobx-react'
import { UserContainer } from './User/UserContainer'
import { SettingModal } from '../Setting/SettingModal'
import { HeaderLogo } from './HeaderLogo'

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
          <HeaderLogo/>
          <SettingModal/>
      </div>
  })
