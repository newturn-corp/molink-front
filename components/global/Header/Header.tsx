import React from 'react'
import { observer } from 'mobx-react'
import { UserContainer } from './User/UserContainer'
import { SettingModal } from '../Setting/SettingModal'
import { HeaderLogo } from './HeaderLogo'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { BrowserView, isBrowser, isMobile, MobileView } from 'react-device-detect'
import { OpenHierarchyButton } from './OpenHierarchyButton'
import { MobilePageTitle } from './Mobile/MobilePageTitle'
import { NotificationButton } from './Notification/NotificationButton'
import { SearchComponent } from './SearchComponent'

export const Header: React.FC<{
  }> = observer(() => {
      return <div
          className='header'
          style={StyleManager.globalStyle.header}
      >
          <UserContainer/>
          {
              isBrowser
                  ? <>
                      {/* <div className='navigator'> */}
                      {/* </div> */}
                      <HeaderLogo/>
                      <NotificationButton/>
                      <SettingModal/>
                      <SearchComponent />
                  </>
                  : <>
                      <OpenHierarchyButton/>
                      <MobilePageTitle/>
                  </>
          }
      </div>
  })
