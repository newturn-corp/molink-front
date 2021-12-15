import React from 'react'
import Document from '../domain/Document'

export const DocumentIcon: React.FC<{
    document: Document
  }> = ({ document }) => {
      return <div className={'front-icon'}>
          {document.icon}
      </div>
  }
