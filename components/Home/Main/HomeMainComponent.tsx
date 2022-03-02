import { observer } from 'mobx-react'
import React from 'react'
import { ContentToolbar } from './Header/ContentToolbar'
import { ContentComponent } from './Content/ContentComponent'
import { PageHierarchyList } from './Header/PageHierarchyList'
import { ToolbarControlButton } from './ToolbarControlButton'
import StyleManager from '../../../manager/global/Style/StyleManager'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      return <>
          <div
              className={'content-container'}
              style={StyleManager.contentStyle.container}
          >
              <ToolbarControlButton/>
              <ContentToolbar/>
              <PageHierarchyList/>
              <div
                  className={'content-body'}
                  style={StyleManager.contentStyle.body}
              >
                  <ContentComponent/>
              </div>
          </div>
      </>
  })
