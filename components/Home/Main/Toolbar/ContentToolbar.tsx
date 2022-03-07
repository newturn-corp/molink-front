import { observer } from 'mobx-react'
import React from 'react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { EditingButtonGroup } from './EditingButtonGroup'
import { ToolbarOnOffButton } from './ToolbarOnOffButton'

export const ContentToolbar: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      if (!currentHierarchy || !currentHierarchy.openedDocumentId || !currentHierarchy.editable) {
          return <></>
      }
      return <div
          className={'content-toolbar'}
          style={StyleManager.contentStyle.toolbar}
      >
          {
              EditorManager.isToolbarOpen
                  ? <>
                      <EditingButtonGroup/>
                  </>
                  : <>
                  </>
          }
          <ToolbarOnOffButton/>
      </div>
  })
