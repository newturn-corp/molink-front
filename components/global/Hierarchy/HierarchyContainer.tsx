import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from './HierarchyContextMenu'
import { DragIndicator } from './DragIndicator'
import { HierarchyComponent } from './HierarchyComponent'

import HierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'
import NewUserManager from '../../../manager/global/NewUserManager'
import { HierarchyName } from './HierarchyName'
import { HierarchyOnOffButton } from './HierarchyOnOffButton'

export const HierarchyContainer: React.FC<{
  }> = observer(() => {
      const width = HierarchyManager.getHierarchyWidth()
      const backgroundColor = NewUserManager.setting ? NewUserManager.setting.hierarchyBackgroundColor : '#FAFAFB'
      const useStyles = makeStyles({
          root: {
              backgroundColor
          },
          paper: {
              width
          }
      })
      const classes = useStyles()
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      if (!currentHierarchy) {
          return <></>
      }

      return (
          <>
              <HierarchyOnOffButton/>
              <Drawer
                  id='filesystem'
                  className='hierarchy'
                  variant="permanent"
                  anchor="left"
                  onContextMenu={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      HierarchyManager.openContextMenu(null)
                  }}
                  style={{
                      width
                  }}
                  classes={classes}
              >
                  {
                      HierarchyManager.isHierarchyOpen
                          ? <>
                              <HierarchyName/>
                              <HierarchyContextMenu/>
                              <HierarchyComponent/>
                              <DragIndicator/>
                          </>
                          : <>
                          </>
                  }

              </Drawer>
          </>
      )
  })
