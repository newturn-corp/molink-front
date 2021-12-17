import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import DirectoryManager from '../../manager/DirectoryManager'
import GlobalManager, { Browser } from '../../manager/GlobalManager'
import { reaction } from 'mobx'

const mousePosition = 236
const isDragging = false
const isFirefox = false

export const DrawerWidthController: React.FC<{
  }> = observer(() => {
      const [controllerPosition, setControllerPosition] = useState(236)
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
                      DirectoryManager.directoryDrawerWidth = GlobalManager.browser !== Browser.Firefox ? event.pageX : GlobalManager.mousePositionX
                  }}>
              </div>
          </>

      )
  })
