import React from 'react'
import Document from '../../../../domain/Document'
import { observer } from 'mobx-react-lite'

export const DocumentIcon: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      return <div className={'icon'}>
          {document.icon}
      </div>
  })
