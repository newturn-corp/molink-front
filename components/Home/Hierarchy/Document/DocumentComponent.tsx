import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import ListItem from '@material-ui/core/ListItem'
import { DocumentTitle } from './DocumentTitle'
import { DocumentIcon } from './DocumentIcon'

import DocumentHierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'
import HierarchyDragManager from '../../../../manager/Home/Hierarchy/HierarchyDragManager'
import UserManager from '../../../../manager/global/UserManager'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import { Collapse, List } from '@material-ui/core'
import { DocumentChildrenOpenButton } from './DocumentChildrenOpenButton'

let ghost
export const DocumentComponent: React.FC<{
    documentId: string,
    depth: number
  }> = observer(({ documentId, depth }) => {
      const divRef = useRef<HTMLDivElement>(null)
      const padding = 8 + depth * 12

      const document = DocumentHierarchyManager.hierarchy.map[documentId]
      const isSelected = DocumentHierarchyManager.hierarchy.selectedDocumentId === document.id
      const isChangingName = DocumentHierarchyManager.hierarchy.nameChangingDocumentId === document.id
      const isOpen = DocumentHierarchyManager.hierarchy.openedDocumentId === document.id
      const isChildrenOpen = !!DocumentHierarchyManager.hierarchy.childrenOpenMap[document.id]

      const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
          ghost = divRef.current.cloneNode()
          ghost.style.backgroundColor = '#e9e9e9'
          ghost.style.color = '#333333'
          ghost.style.width = '240px'
          ghost.style.height = '33px'
          ghost.innerHTML = document.title
          ghost.style.position = 'absolute'
          ghost.style.top = '0px'
          ghost.style.right = '0px'
          globalThis.document.getElementsByClassName('drag-ghost-parent')[0].appendChild(ghost)
          event.dataTransfer.setDragImage(ghost, event.clientX, event.clientY - divRef.current.getBoundingClientRect().y)
          HierarchyDragManager.handleDragStart(document.id)
      }

      // TODO: 백그라운드 고치기
      return (
          <>
              <ListItem
                  id={`document-${document.id}`}
                  button
                  ref={divRef}
                  style={{
                      padding: 0,
                      paddingLeft: padding,
                      paddingRight: 20,
                      backgroundColor: isSelected || isOpen ? '#e9e9e9' : undefined
                  }}
                  draggable={!isChangingName && document.userId === UserManager.profile.userId}
                  onClick={(event) => {
                      if (!isOpen) {
                          RoutingManager.moveTo(Page.Index, `?id=${document.id}`)
                      }
                  }}
                  onDragStart={(event) => handleDragStart(event)}
                  onDragOver={(event) => HierarchyDragManager.handleDragOver(event, document.id)}
                  onDragEnd={(event) => HierarchyDragManager.handleDragEnd(ghost)}
                  onDragLeave={() => HierarchyDragManager.handleDragLeave(document.id)}
                  onContextMenu={(event) => DocumentHierarchyManager.handleRightClick(event, document.id)}
              >
                  <DocumentChildrenOpenButton documentId={documentId}/>
                  <DocumentIcon document={document}/>
                  <DocumentTitle
                      documentId={documentId}
                  />
              </ListItem>
              <Collapse in={isChildrenOpen} timeout="auto" unmountOnExit>
                  <List id={`document-child-list-${document.id}`} component="div" disablePadding>
                      {
                          document.children.map(childDocumentId => {
                              return <DocumentComponent key={Math.random()} documentId={childDocumentId} depth={depth + 1}/>
                          })
                      }
                  </List>
              </Collapse>
          </>
      )
  })
