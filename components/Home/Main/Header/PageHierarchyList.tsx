import { observer } from 'mobx-react'
import React from 'react'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'

export const PageHierarchyList: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      if (!currentHierarchy || !currentHierarchy.openedDocumentId) {
          return <></>
      }
      const pages = currentHierarchy.getPageHierarchy(currentHierarchy.openedDocumentId)
      return <div
          className={'page-hierarchy-list'}
          style={{
              top: EditorManager.isToolbarOpen ? 81 : 25
          }}
      >
          {
              pages.map((page, index) => {
                  return <>
                      <div
                          className='document-block'
                          key={`hierarchy-document-block-${index}`}
                          onClick={async () => {
                              if (page.id === currentHierarchy.openedDocumentId) {
                                  return
                              }
                              await RoutingManager.moveTo(Page.Blog, `/${page.id}`)
                          }}
                      >
                          {page.icon + ' ' + page.title}
                      </div>
                      {
                          pages.length - 1 === index
                              ? <></>
                              : <div
                                  className={'document-divider'}
                                  key={`document-divider-${index}`}
                              >
                                  /
                              </div>
                      }
                  </>
              })
          }
      </div>
  })
