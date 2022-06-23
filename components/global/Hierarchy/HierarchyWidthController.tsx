import React from 'react'
import { observer } from 'mobx-react'
import GlobalManager from '../../../manager/global/GlobalManager'
import UserManager from '../../../manager/global/User/UserManager'
import StyleManager from '../../../manager/global/Style/StyleManager'
import EventManager from '../../../manager/global/Event/EventManager'
import { Event } from '../../../manager/global/Event/Event'

export const HierarchyWidthController: React.FC<{
  }> = observer(() => {
      return (
          <>
              <div
                  className={'hierarchy-width-controller'}
                  style={StyleManager.hierarchyStyle.widthControllerStyle}
                  onDrag={async event => {
                      const value = GlobalManager.mousePositionX
                      if (Math.round(value) % 3 !== 0) {
                          return
                      }
                      UserManager.setting.hierarchyWidth = value
                      await EventManager.issueEvent(
                          Event.HierarchyWidthChange,
                          { width: value }
                      )
                  }}
                  onDragEnd={event => {
                      UserManager.setting.updateHierarchyWidth(UserManager.setting.hierarchyWidth)
                  }}
                  draggable='true'
              >
                  <div
                      className={'bar'}
                  />
              </div>
          </>

      )
  })
