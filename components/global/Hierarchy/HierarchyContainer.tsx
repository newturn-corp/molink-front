import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from './HierarchyContextMenu'
import { DragIndicator } from './DragIndicator'
import { HierarchyComponent } from './HierarchyComponent'
import { HierarchyName } from './HierarchyName'
import { HierarchyOnOffButton } from './HierarchyOnOffButton'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import UserManager from '../../../manager/global/User/UserManager'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { HierarchyButtonGroup } from './HierarchyButtonGroup'
import { BrowserView, isBrowser, MobileView } from 'react-device-detect'
import { HierarchyOptionDrawer } from './HierarchyOptionDrawer/HierarchyOptionDrawer'

export const HierarchyContainer: React.FC<{
  }> = observer(() => {
      const backgroundColor = UserManager.setting.hierarchyBackgroundColor
      const useStyles = makeStyles({
          root: {
              backgroundColor
          },
          paper: {
              ...StyleManager.hierarchyStyle.paperStyle
          }
      })
      const classes = useStyles()
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)

      if (!currentHierarchy) {
          return <></>
      }

      return (
          <>
              <BrowserView>
                  <HierarchyOnOffButton/>
              </BrowserView>
              <MobileView>
                  <HierarchyOptionDrawer/>
              </MobileView>
              <Drawer
                  id='filesystem'
                  className='hierarchy'
                  variant={isBrowser ? 'permanent' : 'temporary'}
                  anchor="left"
                  onContextMenu={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      HierarchyManager.openContextMenu(null)
                  }}
                  open={isBrowser ? undefined : HierarchyManager.isHierarchyOpen}
                  onClose={isBrowser
                      ? undefined
                      : () => {
                          HierarchyManager.isHierarchyOpen = false
                      }}
                  style={StyleManager.hierarchyStyle.containerStyle}
                  classes={classes}
              >
                  {
                      HierarchyManager.isHierarchyOpen
                          ? <>
                              <HierarchyName/>
                              <HierarchyButtonGroup/>
                              <HierarchyContextMenu/>
                              <HierarchyComponent/>
                              {
                                  currentHierarchy.editable ? <DragIndicator/> : <></>
                              }
                          </>
                          : <>
                          </>
                  }

              </Drawer>
          </>
      )
  })
