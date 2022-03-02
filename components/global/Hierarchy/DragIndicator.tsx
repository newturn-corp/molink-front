import React from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'
import PageDragManager from '../../../manager/global/Hierarchy/PageDragManager'

export const DragIndicator: React.FC<{
  }> = observer(() => {
      return (
          <Tooltip
              placement="right"
              title={PageDragManager.viewerText}
              visible={true}
          >
              <div
                  className='drag-indicator'
                  style={{
                      width: 240
                  }}
              >
              </div>
          </Tooltip>
      )
  })
