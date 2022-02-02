import { observer } from 'mobx-react'
import React from 'react'
import ContentManager from '../../../../manager/ContentManager'
import { DocumentHierarchyList } from './DocumentHierarchyList'
import { LockButton } from './LockButton'

export const ContentHeader: React.FC<{
  }> = observer(() => {
      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <div className={'content-toolbar'}>
          <DocumentHierarchyList/>
          <div className={'right-content-toolbar'}>
              <LockButton/>
          </div>
      </div>
  })
