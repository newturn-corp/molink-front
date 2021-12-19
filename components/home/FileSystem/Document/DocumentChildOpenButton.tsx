import React from 'react'
import Document from '../../../../domain/Document'
import { observer } from 'mobx-react-lite'
import EventManager from '../../../../manager/home/EventManager'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'

export const DocumentChildOpenButton: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          EventManager.issueOpenDocumentChildrenEvent(document, !document.isChildrenOpen)
      }

      return <div className='child-open-button' onClick={(event) => handleClick(event)}>
          {
              document.isChildrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
