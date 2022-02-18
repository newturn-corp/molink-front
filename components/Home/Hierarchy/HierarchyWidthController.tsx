import React from 'react'
import { observer } from 'mobx-react'
import GlobalManager, { Browser } from '../../../manager/global/GlobalManager'
import DocumentHierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'
import NewUserManager from '../../../manager/global/NewUserManager'

export const HierarchyWidthController: React.FC<{
  }> = observer(() => {
      const left = NewUserManager.setting ? NewUserManager.setting.hierarchyWidth : '10vw'
      return (
          <>
              <div className={'hierarchy-width-controller'}
                  style={{ left }}
                  onDrag={event => {
                      // const value = GlobalManager.browser !== Browser.Firefox ? event.pageX : GlobalManager.mousePositionX
                      const value = GlobalManager.mousePositionX
                      if (Math.round(value) % 5 !== 0) {
                          return
                      }
                      const pageWidth = window.innerWidth
                      NewUserManager.setting.hierarchyWidth = `${Math.max(value / pageWidth * 100, 10)}vw`
                  }}
                  onDragEnd={event => {
                      console.log(NewUserManager.setting.hierarchyWidth)
                      // NewUserManager.setting.updateHierarchyWidth(NewUserManager.setting.hierarchyWidth)
                      NewUserManager.setting.updateHierarchyWidth(NewUserManager.setting.hierarchyWidth)
                  }}
                  draggable='true'
              >
              </div>
          </>

      )
  })
