import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { ContentToolbar } from './Toolbar/ContentToolbar'
import { ContentComponent } from './Content/ContentComponent'
import { PageHierarchyList } from './Header/PageHierarchyList'
import { ToolbarControlButton } from './ToolbarControlButton'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { ContentHeader } from './Header/ContentHeader'
import EditorManager from '../../../manager/Blog/EditorManager'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      useEffect(() => {
          EditorManager.contentBody = document.getElementById('content-body')
      }, [])
      return <>
          <div
              className={'content-container'}
              style={StyleManager.contentStyle.container}
          >
              <ContentToolbar/>
              <ContentHeader/>
              <div
                  id={'content-body'}
                  className={'content-body'}
                  style={StyleManager.contentStyle.body}
              >
                  <ContentComponent/>
              </div>
          </div>
      </>
  })
