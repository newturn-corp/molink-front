import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { ContentToolbar } from './Toolbar/ContentToolbar'
import { ContentComponent } from './Content/ContentComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { ContentHeader } from './Header/ContentHeader'
import EditorManager from '../../../manager/Blog/EditorManager'
import { BrowserView } from 'react-device-detect'

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
              <BrowserView>
                  <ContentToolbar/>
                  <ContentHeader/>
              </BrowserView>
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
