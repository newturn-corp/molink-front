import React from 'react'
import { observer } from 'mobx-react-lite'
import Document from '../../../../domain/Document'

export const DocumentIcon: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      return <div className={'icon'}>
          {document.meta.icon}
      </div>
  })
