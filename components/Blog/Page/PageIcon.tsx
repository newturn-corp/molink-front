import React from 'react'
import { observer } from 'mobx-react-lite'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import Blog from '../../../manager/global/Blog/Blog'

export const PageIcon: React.FC<{
    document: HierarchyDocumentInfoInterface
  }> = observer(({ document }) => {
      // if (!Blog.pageHierarchy.headerIconActive) {
      //     return <></>
      // }

      return <div className={'icon-container'}>
          <div className={'icon'}>
              {document.icon}
          </div>
      </div>
  })
