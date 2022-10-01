import { observer } from 'mobx-react'
import React from 'react'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

export const PageHierarchyList: React.FC<{
  }> = observer(() => {
      const pageHierarchy = Blog.pageHierarchy
      const openedPage = pageHierarchy.openedPage
      const pages = pageHierarchy.getPageHierarchy(openedPage.pageId)
      return <div
          className={'page-hierarchy-list'}
          // style={{
          //     top: EditorPage.editor.toolbar.isEditing ? 81 : 25
          // }}
      >
          {
              pages.map((page, index) => {
                  return <div
                      key={`page-hierarchy-container-${index}`}
                      style={{
                          display: 'flex',
                          flexDirection: 'row'
                      }}
                  >
                      <div
                          className='document-block'
                          key={`page-block-${index}`}
                          onClick={async () => {
                              if (page.id === openedPage.pageId) {
                                  return
                              }
                              await RoutingManager.moveTo(Page.Editor, `/${page.id}`)
                          }}
                      >
                          {page.icon + ' ' + page.title}
                      </div>
                      {
                          pages.length - 1 === index
                              ? <></>
                              : <div
                                  className={'document-divider'}
                                  key={`page-hierarchy-divider-${index}`}
                              >
                                  /
                              </div>
                      }
                  </div>
              })
          }
      </div>
  })
