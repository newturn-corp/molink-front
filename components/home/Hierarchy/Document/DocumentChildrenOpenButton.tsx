import React from 'react'
import { observer } from 'mobx-react-lite'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import { HierarchyComponentBlockInterface } from '@newturn-develop/types-molink'
import DocumentHierarchyManager from '../../../../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'
import DocumentManager from '../../../../manager/Home/DocumentManager'

export const DocumentChildrenOpenButton: React.FC<{
    hierarchyComponentBlock: HierarchyComponentBlockInterface
  }> = observer(({ hierarchyComponentBlock }) => {
      const isChildrenOpen = !!DocumentHierarchyManager.hierarchy.childrenOpenMap[hierarchyComponentBlock.id]

      const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          await DocumentManager.updateDocumentChildrenOpen(hierarchyComponentBlock.id, !isChildrenOpen)
      }

      return <div className='child-open-button' onClick={(event) => handleClick(event)}>
          {
              isChildrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
