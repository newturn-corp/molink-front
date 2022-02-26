import { observer } from 'mobx-react'
import React from 'react'
import { PageHierarchyList } from './PageHierarchyList'
import { LockButton } from './LockButton'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Home/EditorManager'

export const ContentHeader: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      if (!currentHierarchy || !currentHierarchy.openedDocumentId) {
          return <></>
      }
      return <div className={'content-toolbar'}>
          <PageHierarchyList/>
          <div className={'right-content-toolbar'}>
              <LockButton/>
          </div>
      </div>
  })
