import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import ListItem from '@material-ui/core/ListItem'
import { PageTitle } from './PageTitle'
import { PageIcon } from './PageIcon'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import { Collapse, List } from '@material-ui/core'
import { PageChildrenOpenButton } from './PageChildrenOpenButton'
import { PageAddChildButton } from './PageAddChildButton'
import { PageMenuButton } from './PageMenuButton'
import UserManager from '../../../../manager/global/User/UserManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { isMobile } from 'react-device-detect'
import StyleManager from '../../../../manager/global/Style/StyleManager'

let ghost
export const PageComponent: React.FC<{
    documentId: string,
    depth: number
  }> = observer(({ documentId, depth }) => {
      const [isMouseOver, setIsMouseOver] = useState(false)
      const divRef = useRef<HTMLDivElement>(null)
      const padding = 4 + depth * 12

      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const pageDragManager = currentHierarchy.pageDragManager
      const page = currentHierarchy.map[documentId]
      const isSelected = currentHierarchy.selectedPageId === page.id
      const isChangingName = currentHierarchy.nameChangingPageId === page.id
      const isOpen = currentHierarchy.openedPageId === page.id
      const hierarchySelectedDocumentBackgroundColor = UserManager.setting ? UserManager.setting.hierarchySelectedDocumentBackgroundColor : '#ECEEF0'

      const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
          ghost = divRef.current.cloneNode()
          ghost.style.backgroundColor = '#e9e9e9'
          ghost.style.color = '#333333'
          ghost.style.width = '240px'
          ghost.style.height = '33px'
          ghost.innerHTML = page.title
          ghost.style.position = 'absolute'
          ghost.style.top = '0px'
          ghost.style.right = '0px'
          globalThis.document.getElementsByClassName('drag-ghost-parent')[0].appendChild(ghost)
          event.dataTransfer.setDragImage(ghost, event.clientX, event.clientY - divRef.current.getBoundingClientRect().y)
          pageDragManager.handleDragStart(page.id)
      }
      // TODO: 백그라운드 고치기
      return (
          <>
              <ListItem
                  id={`document-${page.id}`}
                  key={`page-${page.id}`}
                  className={'page-component'}
                  button
                  ref={divRef}
                  style={{
                      ...StyleManager.hierarchyStyle.pageComponentStyle,
                      padding: 0,
                      paddingLeft: padding,
                      marginRight: 5,
                      backgroundColor: isSelected || isOpen ? hierarchySelectedDocumentBackgroundColor : undefined,
                      borderRadius: 8,
                      marginLeft: 8,
                      width: 'inherit'
                  }}
                  draggable={!isChangingName && currentHierarchy.editable}
                  onClick={async (event) => {
                      if (!isOpen) {
                          await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${documentId}`)
                      }
                  }}
                  onDragStart={(event) => handleDragStart(event)}
                  onDragOver={(event) => pageDragManager.handleDragOver(event, page.id)}
                  onDragEnd={(event) => pageDragManager.handleDragEnd(ghost)}
                  onDragLeave={() => pageDragManager.handleDragLeave(page.id)}
                  onContextMenu={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      HierarchyManager.openContextMenu(page.id)
                  }}
                  onMouseOver={() => setIsMouseOver(true)}
                  onMouseLeave={() => setIsMouseOver(false)}
              >
                  <PageChildrenOpenButton
                      documentId={documentId}
                      key={`page-children-open-${page.id}`}
                  />
                  <PageIcon
                      document={page}
                      key={`page-icon-${page.id}`}
                  />
                  <PageTitle
                      documentId={documentId}
                      key={`page-title-${page.id}`}
                  />
                  {
                      (isMouseOver || isMobile) && currentHierarchy.editable
                          ? <>
                              <PageMenuButton documentId={documentId}/>
                              <PageAddChildButton documentId={documentId}/>
                          </>
                          : <>
                          </>
                  }
              </ListItem>
              <Collapse in={page.childrenOpen} timeout="auto" unmountOnExit>
                  <List id={`document-child-list-${page.id}`} component="div" disablePadding>
                      {
                          page.children.map(childDocumentId => {
                              return <PageComponent key={Math.random()} documentId={childDocumentId} depth={depth + 1}/>
                          })
                      }
                  </List>
              </Collapse>
          </>
      )
  })