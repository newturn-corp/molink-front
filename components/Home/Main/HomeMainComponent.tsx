import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { ContentToolbar } from './Toolbar/ContentToolbar'
import { ContentComponent } from './Content/ContentComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { ContentHeader } from './Header/ContentHeader'
import EditorManager from '../../../manager/Blog/EditorManager'
import { BrowserView, MobileView } from 'react-device-detect'
import { MobileToolbar } from './MobileToolbar/MobileToolbar'
import { CommandDrawer } from './Content/CommandDrawer'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import { UserPageListComponent } from './Content/UserPageListComponent'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      useEffect(() => {
          EditorManager.contentBody = document.getElementById('content-body')
      }, [])

      return <>
          <div
              className={'content-container'}
              style={StyleManager.contentStyle.container}
          >
              <BrowserView>
                  <ContentToolbar/>
                  <ContentHeader/>
              </BrowserView>
              {
                  !currentHierarchy || !currentHierarchy.openedPageId
                      ? <UserPageListComponent />
                      : <div
                          id={'content-body'}
                          className={'content-body'}
                          style={StyleManager.contentStyle.body}
                      >
                          <ContentComponent/>
                      </div>
              }
              <MobileView>
                  <MobileToolbar/>
                  <CommandDrawer/>
              </MobileView>
          </div>
      </>
  })
