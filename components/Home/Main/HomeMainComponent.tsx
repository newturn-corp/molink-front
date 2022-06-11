import { observer } from 'mobx-react'
import React from 'react'
import { EditorToolbarComponent } from '../../Blog/EditorPage/Toolbar/EditorToolbarComponent'
import { ContentComponent } from './Content/ContentComponent'
import { EditorHeader } from '../../Blog/EditorPage/Header/EditorHeader'
import { BrowserView, MobileView } from 'react-device-detect'
import { MobileToolbar } from './MobileToolbar/MobileToolbar'
import { CommandDrawer } from './Content/CommandDrawer'
import { BlogUserContent } from '../../Blog/UserContent/BlogUserContent'
import BlogPage from '../../../manager/Blog/BlogPage'
import { BlogPageType } from '../../../manager/Blog/Blog'
import ContentContainer from '../../global/ContentContainer'
import { EditorBodyComponent } from '../../Blog/EditorPage/EditorBodyComponent'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const HomeMainComponent: React.FC<{
  }> = observer(() => {
      return <>
          <ContentContainer>
              {
                  BlogPage.pageType === BlogPageType.NormalPage
                      ? <>
                          {
                              EditorPage.editor && <>
                                  <BrowserView>
                                      <EditorToolbarComponent/>
                                      <EditorHeader/>
                                  </BrowserView>
                                  <EditorBodyComponent>
                                      <ContentComponent/>
                                  </EditorBodyComponent>
                              </>
                          }
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
