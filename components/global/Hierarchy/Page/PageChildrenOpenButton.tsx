import React from 'react'
import { observer } from 'mobx-react'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import Blog from '../../../../manager/global/Blog/Blog'

export const PageChildrenOpenButton: React.FC<{
    pageID: string
  }> = observer(({ pageID }) => {
      const pageHierarchy = Blog.pageHierarchy
      const page = pageHierarchy.map[pageID]

      const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          await pageHierarchy.updateHierarchyChildrenOpen(pageID, !page.childrenOpen)
      }

      return <div
          className='child-open-button'
          onClick={(event) => handleClick(event)}
      >
          {
              page.childrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
