import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from './HierarchyContextMenu'
import { DragIndicator } from './DragIndicator'
import { HierarchyComponent } from './HierarchyComponent'

import HierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'
import NewUserManager from '../../../manager/global/NewUserManager'

export const HierarchyContainer: React.FC<{
  }> = observer(() => {
      const width = NewUserManager.setting ? NewUserManager.setting.hierarchyWidth : '10vw'
      const useStyles = makeStyles({
          root: {
          },
          paper: {
              width
          }
      })
      const classes = useStyles()
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
      if (!currentHierarchy) {
          return <></>
      }

      return (
          <>
              <Drawer
                  id='filesystem'
                  className='hierarchy'
                  variant="permanent"
                  anchor="left"
                  onContextMenu={(event) => HierarchyManager.handleRightClick(event, null)}
                  style={{
                      width
                  }}
                  classes={classes}
              >
                  <HierarchyContextMenu/>
                  <HierarchyComponent/>
                  <DragIndicator/>
              </Drawer>
          </>
      )
  })
