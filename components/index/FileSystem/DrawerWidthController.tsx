import React, { useState } from 'react'
import { observer } from 'mobx-react'
import GlobalManager, { Browser } from '../../../manager/GlobalManager'
import FileSystemManager from '../../../manager/FileSystemManager'

export const DrawerWidthController: React.FC<{
  }> = observer(() => {
      //   const [controllerPosition, setControllerPosition] = useState(FileSystemManager.directoryDrawerWidth - 3)
      if (!FileSystemManager.documents) {
          return <></>
      }
      const left = FileSystemManager.directoryDrawerWidth - 3
      return (
          <>
              <div className={'drawer-width-controller'}
                  style={{ left }}
                  onDrag={event => {
                      const value = GlobalManager.browser !== Browser.Firefox ? event.pageX : GlobalManager.mousePositionX
                      if (Math.round(value) % 5 !== 0) {
                          return
                      }
                      FileSystemManager.directoryDrawerWidth = value
                  }}
                  draggable='true'
              >
              </div>
          </>

      )
  })
