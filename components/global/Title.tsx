import React from 'react'
import { observer } from 'mobx-react'
import ContentManager from '../../manager/ContentManager'

export const Title: React.FC<{
  }> = observer(() => {
      const headText = ContentManager.openedDocument ? ContentManager.openedDocument.meta.title : 'Knowlink'
      return <title>{headText}</title>
  })
