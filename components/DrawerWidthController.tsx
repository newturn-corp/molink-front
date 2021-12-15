import React, { useState } from 'react'
import { observer } from 'mobx-react'
import DirectoryManager from '../manager/DirectoryManager'

export const DrawerWidthController: React.FC<{
  }> = observer(() => {
      const [controllerPosition, setControllerPosition] = useState(230)
      return (
          <>
              <div className={'drawer-width-controller'}
                  style={{ left: controllerPosition }}
                  onDrag={event => {
                      setControllerPosition(event.pageX)
                  }}
                  onDragEnd={event => {
                      setControllerPosition(event.pageX - 10)
                      DirectoryManager.directoryDrawerWidth = event.pageX
                      console.log(DirectoryManager.directoryDrawerWidth)
                  }}>
              </div>
          </>

      )
  })
