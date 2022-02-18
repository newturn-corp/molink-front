import { observer } from 'mobx-react'
import React from 'react'
import { DocumentHierarchyList } from './DocumentHierarchyList'
import { LockButton } from './LockButton'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Home/EditorManager'

export const ContentHeader: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
      if (!currentHierarchy) {
          return <></>
      }
      return <div className={'content-toolbar'}>
          <DocumentHierarchyList/>
          <div className={'right-content-toolbar'}>
              <LockButton/>
          </div>
      </div>
  })
