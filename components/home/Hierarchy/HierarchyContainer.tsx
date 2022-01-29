import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from './HierarchyContextMenu'
import { DragIndicator } from './DragIndicator'
import { HierarchyComponent } from './HierarchyComponent'

import DocumentHierarchyManager from '../../../manager/Home/HierarchyManager/HierarchyManager'

export const HierarchyContainer: React.FC<{
  }> = observer(() => {
      //   const width = HierarchyManager.hierarchy ? HierarchyManager.hierarchy.width + 1 : 241
      const width = 240
      const useStyles = makeStyles({
          root: {
          },
          paper: {
              width
          }
      })
      const classes = useStyles()

      if (!DocumentHierarchyManager.hierarchy) {
          return <></>
      }

      return (
          <>
              <Drawer
                  id='filesystem'
                  className='drawer'
                  variant="permanent"
                  anchor="left"
                  onContextMenu={(event) => DocumentHierarchyManager.handleRightClick(event, null)}
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
