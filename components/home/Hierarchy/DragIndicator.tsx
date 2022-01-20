import React from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'
import DocumentDragManager from '../../../manager/Home/DocumentHierarchyManager/DocumentDragManager'
import DocumentHierarchyManager from '../../../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'

export const DragIndicator: React.FC<{
  }> = observer(() => {
      return (
          <Tooltip
              placement="right"
              title={DocumentDragManager.viewerText}
              visible={true}
          >
              <div className='drag-indicator' style={{
                  width: 240
              }}>
              </div>
          </Tooltip>
      )
  })
