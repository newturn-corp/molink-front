import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import Document from '../../../../domain/renew/Document'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { Collapse } from '@material-ui/core'
import { DocumentTitle } from './DocumentTitle'
import { DocumentIcon } from './DocumentIcon'
import { DocumentChildOpenButton } from './DocumentChildOpenButton'

import FileSystemManager from '../../../../manager/renew/FileSystemManager'
import EventManager, { Event } from '../../../../manager/home/EventManager'
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

      const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
          if (!FileSystemManager.draggingDocument) {
              return
          }
          if (FileSystemManager.draggingDocument.meta.id === document.directoryInfo.meta.id) {
              return
          }
          event.preventDefault()
          const mouseY = event.pageY
          const y = divRef.current.getBoundingClientRect().y
          const height = divRef.current.offsetHeight
          const topStandard = y + height * 0.33
          const bottomStandard = y + height * 0.67
          if (mouseY < topStandard) {
              FileSystemManager.handleDragOver(document, DragLocation.Top)
          } else if (mouseY > bottomStandard) {
              FileSystemManager.handleDragOver(document, DragLocation.Bottom)
          } else {
              FileSystemManager.handleDragOver(document, DragLocation.Middle)
          }
      }

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
          FileSystemManager.handleDragStart(document.directoryInfo.document)
      }

      const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
          globalThis.document.getElementsByClassName('drag-ghost-parent')[0].removeChild(ghost)
      }

      // TODO: 백그라운드 고치기
      return (
          <>
              <ListItem
                  button
                  ref={divRef}
                  style={{
                      padding: 0,
                      paddingLeft: padding,
                      paddingRight: 20,
                      backgroundColor: document.directoryInfo.isSelected ? '#e9e9e9' : undefined
                  }}
                  draggable={!document.directoryInfo.isChangingName}
                  onClick={(event) => {
                      EventManager.issueEvent(Event.OpenDocument, { document: document.directoryInfo.document })
                  }}
                  onDragStart={(event) => handleDragStart(event)}
                  onDragEnd={(event) => handleDragEnd(event)}
                  onDragOver={(event) => handleDragOver(event)}
                  onDragLeave={() => FileSystemManager.handleDragLeave(document)}
                  onDrop={() => FileSystemManager.handleDrop(document)}
                  onContextMenu={(event) => FileSystemManager.handleRightClick(event, document)}>
                  <DocumentChildOpenButton document={document}/>
                  <DocumentIcon document={document}/>
                  <DocumentTitle document={document}/>
              </ListItem>
              <Collapse in={document.directoryInfo.isChildrenOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
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
