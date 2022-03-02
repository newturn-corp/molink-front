import { observer } from 'mobx-react'
import React from 'react'
import { LockButton } from './LockButton'
import { ToolbarEditingButton } from './ToolbarEditingButton'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import { VisibilityButton } from '../Toolbar/VisibilityButton'

export const ContentToolbar: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      if (!currentHierarchy || !currentHierarchy.openedDocumentId || !EditorManager.isToolbarOpen) {
          return <></>
      }
      return <div className={'content-toolbar'}>
          <div
              className={'editing-button-group'}
          >
              <ToolbarEditingButton
                  imgSrc={'/image/editor/toolbar/editing-buttons/video.png'}
                  text={'동영상'}
                  onClick={() => {}}
              />
              <ToolbarEditingButton
                  imgSrc={'/image/editor/toolbar/editing-buttons/file.png'}
                  text={'파일'}
                  onClick={() => {}}
              />
              <ToolbarEditingButton
                  imgSrc={'/image/editor/toolbar/editing-buttons/bold.png'}
                  text={'강조'}
                  onClick={() => {}}
              />
              <ToolbarEditingButton
                  imgSrc={'/image/editor/toolbar/editing-buttons/underline.png'}
                  text={'밑줄'}
                  onClick={() => {}}
              />
              <ToolbarEditingButton
                  imgSrc={'/image/editor/toolbar/editing-buttons/italic.png'}
                  text={'이탤릭'}
                  onClick={() => {}}
              />
          </div>
          <div className={'right-content-toolbar'}>
              <LockButton/>
              <VisibilityButton/>
          </div>
      </div>
  })
