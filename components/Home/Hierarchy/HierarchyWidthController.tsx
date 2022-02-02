import React from 'react'
import { observer } from 'mobx-react'
import GlobalManager, { Browser } from '../../../manager/global/GlobalManager'
import DocumentHierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'

export const HierarchyWidthController: React.FC<{
  }> = observer(() => {
      if (!DocumentHierarchyManager.hierarchy) {
          return <></>
      }
      const left = 240 - 3
      return (
          <>
              <div className={'drawer-width-controller'}
                  style={{ left }}
                  onDrag={event => {
                      const value = GlobalManager.browser !== Browser.Firefox ? event.pageX : GlobalManager.mousePositionX
                      //   if (Math.round(value) % 5 !== 0) {
                      //       return
                      //   }
                      //   Hierarchy.hierarchy.width = Math.max(value, 180)
                  }}
                  onDragEnd={event => {
                      //   Hierarchy.hierarchy.updateWidth()
                  }}
                  draggable='true'
              >
              </div>
          </>

      )
  })
