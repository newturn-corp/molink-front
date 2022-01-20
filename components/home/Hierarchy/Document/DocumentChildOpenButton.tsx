import React from 'react'
import { observer } from 'mobx-react-lite'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import Document from '../../../../domain/Document/Document'

export const DocumentChildOpenButton: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          document.setIsChildrenOpen(!document.hierarchyInfo.isChildrenOpen)
      }

      return <div className='child-open-button' onClick={(event) => handleClick(event)}>
          {
              document.hierarchyInfo.isChildrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
