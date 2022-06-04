import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { ContentToolbarComponent } from './Toolbar/ContentToolbarComponent'
import { ContentComponent } from './Content/ContentComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { EditorHeader } from '../../Blog/EditorPage/Header/EditorHeader'
import { BrowserView, MobileView } from 'react-device-detect'
import { MobileToolbar } from './MobileToolbar/MobileToolbar'
import { CommandDrawer } from './Content/CommandDrawer'
import { BlogUserContent } from '../../Blog/UserContent/BlogUserContent'
import BlogPage from '../../../manager/Blog/BlogPage'
import { BlogPageType } from '../../../manager/Blog/Blog'
import ContentContainer from '../../global/ContentContainer'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      const contentBodyRef = useRef(null)
      useEffect(() => {
          if (EditorPage.editor && contentBodyRef) {
              EditorPage.editor.contentBody = contentBodyRef.current
          }
      }, [EditorPage.editor, contentBodyRef])

      return <>
          <ContentContainer>
              {
                  BlogPage.pageType === BlogPageType.NormalPage
                      ? <>
                          <BrowserView>
                              <ContentToolbarComponent/>
                              <EditorHeader/>
                          </BrowserView>
                          <div
                              id={'content-body'}
                              ref={contentBodyRef}
                              className={'content-body'}
                              style={StyleManager.contentStyle.body}
                          >
                              <ContentComponent/>
                          </div>
                      </>
                      : BlogPage.pageType === BlogPageType.UserMainPage ? <BlogUserContent/> : <></>
              }
              <MobileView>
                  <MobileToolbar/>
                  <CommandDrawer/>
              </MobileView>
          </ContentContainer>
      </>
  })
