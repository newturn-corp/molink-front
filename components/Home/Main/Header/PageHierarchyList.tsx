import { observer } from 'mobx-react'
import React from 'react'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'

export const PageHierarchyList: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const pages = currentHierarchy.getPageHierarchy(currentHierarchy.openedDocumentId)
      return <div className={'page-hierarchy-list'}>
          {
              pages.map((page, index) => {
                  return <>
                      <div
                          className='document-block'
                          key={`hierarchy-document-block-${index}`}
                          onClick={() => {
                              if (page.id === currentHierarchy.openedDocumentId) {
                                  return
                              }
                              RoutingManager.moveTo(Page.Blog, `/${page.id}`)
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
