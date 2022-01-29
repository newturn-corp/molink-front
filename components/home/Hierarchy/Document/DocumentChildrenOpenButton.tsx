import React from 'react'
import { observer } from 'mobx-react'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import HierarchyManager from '../../../../manager/Home/HierarchyManager/HierarchyManager'

export const DocumentChildrenOpenButton: React.FC<{
    documentId: string
  }> = observer(({ documentId }) => {
      const isChildrenOpen = !!HierarchyManager.hierarchy.childrenOpenMap[documentId]
      const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          await HierarchyManager.hierarchy.updateHierarchyChildrenOpen(documentId, !isChildrenOpen)
      }

      return <div className='child-open-button' onClick={(event) => handleClick(event)}>
          {
              isChildrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
