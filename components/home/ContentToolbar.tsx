import { observer } from 'mobx-react'
import React from 'react'
import ContentManager from '../../manager/ContentManager'
import { DocumentHierarchy } from './DocumentHierarchy'
import { RightContentToolbar } from './RightContentToolbar'

export const ContentToolbar: React.FC<{
  }> = observer(() => {
      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <div className={'content-toolbar'}>
          <DocumentHierarchy/>
          <RightContentToolbar/>
      </div>
  })
