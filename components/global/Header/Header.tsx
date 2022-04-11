import React from 'react'
import { observer } from 'mobx-react'
import { UserContainer } from './User/UserContainer'
import { SettingModal } from '../Setting/SettingModal'
import { HeaderLogo } from './HeaderLogo'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { BrowserView, MobileView } from 'react-device-detect'
import { OpenHierarchyButton } from './OpenHierarchyButton'

export const Header: React.FC<{
  }> = observer(() => {
      return <div
          className='header'
          style={StyleManager.globalStyle.header}
      >
          <UserContainer/>
          <BrowserView>
              <div className='navigator'>
              </div>
              {/* <SearchComponent /> */}
              <HeaderLogo/>
              <SettingModal/>
          </BrowserView>
          <MobileView>
              <OpenHierarchyButton/>
          </MobileView>
      </div>
  })
