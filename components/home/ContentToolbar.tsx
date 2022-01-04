import { observer } from 'mobx-react'
import React from 'react'
import StyleManager from '../../manager/StyleManager'
import { DocumentHierarchy } from './DocumentHierarchy'

export const ContentToolbar: React.FC<{
  }> = observer(() => {
      return <div className={'content-toolbar'}>
          <DocumentHierarchy/>
      </div>
  })
