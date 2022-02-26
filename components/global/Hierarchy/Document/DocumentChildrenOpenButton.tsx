import React from 'react'
import { observer } from 'mobx-react'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'

export const DocumentChildrenOpenButton: React.FC<{
    documentId: string
  }> = observer(({ documentId }) => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const document = currentHierarchy.map[documentId]
      const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          await currentHierarchy.updateHierarchyChildrenOpen(documentId, !document.childrenOpen)
      }

      return <div className='child-open-button' onClick={(event) => handleClick(event)}>
          {
              document.childrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
