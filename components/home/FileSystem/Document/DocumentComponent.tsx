import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import Document from '../../../../domain/Document'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { Collapse } from '@material-ui/core'
import DirectoryManager from '../../../../manager/DirectoryManager'
import { DocumentTitle } from './DocumentTitle'
import ContentManager from '../../../../manager/home/ContentManager'
import { DocumentIcon } from './DocumentIcon'
import { DocumentChildOpenButton } from './DocumentChildOpenButton'

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
          if (!DirectoryManager.draggingDocument) {
              return
          }
          if (DirectoryManager.draggingDocument.id === document.id) {
              return
          }
          event.preventDefault()
          const mouseY = event.pageY
          const y = divRef.current.getBoundingClientRect().y
          const height = divRef.current.offsetHeight
          const topStandard = y + height * 0.33
          const bottomStandard = y + height * 0.67
          if (mouseY < topStandard) {
              DirectoryManager.handleDragOver(document, DragLocation.Top)
          } else if (mouseY > bottomStandard) {
              DirectoryManager.handleDragOver(document, DragLocation.Bottom)
          } else {
              DirectoryManager.handleDragOver(document, DragLocation.Middle)
          }
      }

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
          DirectoryManager.handleDragStart(document)
      }

      const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
          globalThis.document.getElementsByClassName('drag-ghost-parent')[0].removeChild(ghost)
      }

      return (
          <>
              <ListItem
                  button
                  ref={divRef}
                  style={{
                      padding: 0,
                      paddingLeft: padding,
                      paddingRight: 20,
                      backgroundColor: document.isSelected || document.isOpen ? '#e9e9e9' : undefined
                  }}
                  draggable={!document.isChangingName}
                  onClick={(event) => ContentManager.openDocument(document)}
                  onDragStart={(event) => handleDragStart(event)}
                  onDragEnd={(event) => handleDragEnd(event)}
                  onDragOver={(event) => handleDragOver(event)}
                  onDragLeave={() => DirectoryManager.handleDragLeave(document)}
                  onDrop={() => DirectoryManager.handleDrop(document)}
                  onContextMenu={(event) => DirectoryManager.handleRightClick(event, document)}>
                  <DocumentChildOpenButton document={document}/>
                  <DocumentIcon document={document}/>
                  <DocumentTitle document={document}/>
              </ListItem>
              <Collapse in={document.isChildrenOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                      {
                          document.children.map(child => {
                              return <DocumentComponent key={Math.random()} document={child} depth={depth + 1}/>
                          })
                      }
                  </List>
              </Collapse>
          </>
      )
  })
