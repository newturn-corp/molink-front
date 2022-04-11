import React from 'react'
import { observer } from 'mobx-react-lite'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'

export const PageIcon: React.FC<{
    document: HierarchyDocumentInfoInterface
  }> = observer(({ document }) => {
      return <div className={'icon-container'}>
          <div className={'icon'}>
              {document.icon}
          </div>
      </div>
  })
