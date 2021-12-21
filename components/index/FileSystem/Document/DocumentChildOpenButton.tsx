import React from 'react'
import { observer } from 'mobx-react-lite'
import EventManager, { Event } from '../../../../manager/home/EventManager'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import DocumentDirectoryInfo from '../../../../domain/renew/DocumentDirectoryInfo'
import Document from '../../../../domain/renew/Document'

export const DocumentChildOpenButton: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          EventManager.issueEvent(Event.DocumentChildrenOpen, {
              childrenOpen: !document.directoryInfo.isChildrenOpen
          })
      }

      return <div className='child-open-button' onClick={(event) => handleClick(event)}>
          {
              document.directoryInfo.children
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
