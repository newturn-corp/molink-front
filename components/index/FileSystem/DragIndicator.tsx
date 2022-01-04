import React, { useState } from 'react'
import { observer } from 'mobx-react'

import FileSystemManager from '../../../manager/FileSystemManager'
import { Tooltip } from 'antd'
import FileDragManager from '../../../manager/FileSystemManager/FileDragManager'

export const DragIndicator: React.FC<{
  }> = observer(() => {
      if (!FileSystemManager.documents) {
          return <></>
      }
      return (
          <Tooltip
              placement="right"
              title={FileDragManager.viewerText}
              visible={true}
          >
              <div className='drag-indicator' style={{
                  width: FileSystemManager.fileSystemWidth
              }}>
              </div>
          </Tooltip>
      )
  })
