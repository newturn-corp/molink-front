import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import Document from '../../../../domain/Document'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { Collapse } from '@material-ui/core'
import { DocumentTitle } from './DocumentTitle'
import { DocumentIcon } from './DocumentIcon'
import { DocumentChildOpenButton } from './DocumentChildOpenButton'

import FileSystemManager from '../../../../manager/FileSystemManager'
import EventManager, { Event } from '../../../../manager/EventManager'
import FileDragManager from '../../../../manager/FileSystemManager/FileDragManager'
import UserManager from '../../../../manager/UserManager'
import RoutingManager, { Page } from '../../../../manager/RoutingManager'
enum DragLocation {
    Top,
    Middle,
    Bottom
}

let ghost
export const DocumentComponent: React.FC<{
    document: Document,
    depth: number
  }> = observer(({ document, depth }) => {
      const divRef = useRef<HTMLDivElement>(null)
      const padding = 8 + depth * 12

      const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
          ghost = divRef.current.cloneNode()
          ghost.style.backgroundColor = '#e9e9e9'
          ghost.style.color = '#333333'
          ghost.style.width = '240px'
          ghost.style.height = '33px'
          ghost.innerHTML = document.directoryInfo.meta.title
          ghost.style.position = 'absolute'
          ghost.style.top = '0px'
          ghost.style.right = '0px'
          globalThis.document.getElementsByClassName('drag-ghost-parent')[0].appendChild(ghost)
          event.dataTransfer.setDragImage(ghost, event.clientX, event.clientY - divRef.current.getBoundingClientRect().y)
          FileDragManager.handleDragStart(document.directoryInfo.document)
      }

      // TODO: 백그라운드 고치기
      return (
          <>
              <ListItem
                  id={`document-${document.meta.id}`}
                  button
                  ref={divRef}
                  style={{
                      padding: 0,
                      paddingLeft: padding,
                      paddingRight: 20,
                      backgroundColor: document.directoryInfo.isSelected || document.directoryInfo.isOpen ? '#e9e9e9' : undefined
                  }}
                  draggable={!document.directoryInfo.isChangingName && document.meta.userId === UserManager.userId}
                  onClick={(event) => {
                      if (!document.directoryInfo.isOpen) {
                          RoutingManager.moveTo(Page.Index, `?id=${document.meta.id}`)
                      }
                  }}
                  onDragStart={(event) => handleDragStart(event)}
                  onDragEnd={(event) => FileDragManager.handleDragEnd(ghost)}
                  onDragOver={(event) => FileDragManager.newHandleDragOver(event, document)}
                  onDragLeave={() => FileDragManager.handleDragLeave(document)}
                  onContextMenu={(event) => FileSystemManager.handleRightClick(event, document)}>
                  <DocumentChildOpenButton document={document}/>
                  <DocumentIcon document={document}/>
                  <DocumentTitle document={document}/>
              </ListItem>
              <Collapse in={document.directoryInfo.isChildrenOpen} timeout="auto" unmountOnExit>
                  <List id={`document-child-list-${document.meta.id}`} component="div" disablePadding>
                      {
                          document.directoryInfo.children.map(child => {
                              return <DocumentComponent key={Math.random()} document={child} depth={depth + 1}/>
                          })
                      }
                  </List>
              </Collapse>
          </>
      )
  })
