import React from 'react'
import { observer } from 'mobx-react'
import GlobalManager, { Browser } from '../../../manager/global/GlobalManager'
import NewUserManager from '../../../manager/global/NewUserManager'
import HierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'

export const HierarchyWidthController: React.FC<{
  }> = observer(() => {
      const left = HierarchyManager.getHierarchyWidth()
      return (
          <>
              <div className={'hierarchy-width-controller'}
                  style={{ left }}
                  onDrag={event => {
                      const value = GlobalManager.mousePositionX
                      if (Math.round(value) % 3 !== 0) {
                          return
                      }
                      NewUserManager.setting.hierarchyWidth = value
                  }}
                  onDragEnd={event => {
                      NewUserManager.setting.updateHierarchyWidth(NewUserManager.setting.hierarchyWidth)
                  }}
                  draggable='true'
              >
              </div>
          </>

      )
  })
