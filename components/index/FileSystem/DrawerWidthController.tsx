import React, { useState } from 'react'
import { observer } from 'mobx-react'
import GlobalManager, { Browser } from '../../../manager/GlobalManager'
import FileSystemManager from '../../../manager/FileSystemManager'

export const DrawerWidthController: React.FC<{
  }> = observer(() => {
      const [controllerPosition, setControllerPosition] = useState(FileSystemManager.directoryDrawerWidth - 3)
      if (!FileSystemManager.documents) {
          return <></>
      }
      return (
          <>
              <div className={'drawer-width-controller'}
                  style={{ left: controllerPosition }}
                  onDrag={event => {
                      if (GlobalManager.browser !== Browser.Firefox) {
                          setControllerPosition(event.pageX - 3)
                      } else {
                          setControllerPosition(GlobalManager.mousePositionX - 3)
                      }
                  }}
                  draggable='true'
                  onDragEnd={event => {
                      if (GlobalManager.browser !== Browser.Firefox) {
                          setControllerPosition(event.pageX - 3)
                      } else {
                          setControllerPosition(GlobalManager.mousePositionX - 3)
                      }
                      FileSystemManager.directoryDrawerWidth = GlobalManager.browser !== Browser.Firefox ? event.pageX : GlobalManager.mousePositionX
                  }}>
              </div>
          </>

      )
  })
