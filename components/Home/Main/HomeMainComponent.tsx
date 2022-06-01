import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { ContentToolbar } from './Toolbar/ContentToolbar'
import { ContentComponent } from './Content/ContentComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { EditorHeader } from '../../Blog/EditorPage/Header/EditorHeader'
import EditorManager from '../../../manager/Blog/EditorManager'
import { BrowserView, MobileView } from 'react-device-detect'
import { MobileToolbar } from './MobileToolbar/MobileToolbar'
import { CommandDrawer } from './Content/CommandDrawer'
import { BlogUserContent } from '../../Blog/UserContent/BlogUserContent'
import BlogPage from '../../../manager/Blog/BlogPage'
import { BlogPageType } from '../../../manager/Blog/Blog'
import ContentContainer from '../../global/ContentContainer'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      useEffect(() => {
          EditorManager.contentBody = document.getElementById('content-body')
      }, [])

      return <>
          <ContentContainer>
              <BrowserView>
                  <ContentToolbar/>
                  <EditorHeader/>
              </BrowserView>
              {
                  BlogPage.pageType === BlogPageType.NormalPage
                      ? <div
                          id={'content-body'}
                          className={'content-body'}
                          style={StyleManager.contentStyle.body}
                      >
                          <ContentComponent/>
                      </div>
                      : BlogPage.pageType === BlogPageType.UserMainPage ? <BlogUserContent/> : <></>
              }
              <MobileView>
                  <MobileToolbar/>
                  <CommandDrawer/>
              </MobileView>
          </ContentContainer>
      </>
  })
