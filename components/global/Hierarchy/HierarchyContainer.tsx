import React from 'react'
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

export const HierarchyContainer: React.FC<{
  }> = observer(() => {
      const backgroundColor = UserManager.setting.hierarchyBackgroundColor
      const useStyles = makeStyles({
          root: {
              backgroundColor
          },
          paper: StyleManager.hierarchyStyle.containerStyle as any
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
                  style={StyleManager.hierarchyStyle.containerStyle}
                  classes={classes}
              >
                  {
                      HierarchyManager.isHierarchyOpen
                          ? <>
                              <HierarchyName/>
                              <div
                                  className={'hierarchy-divider'}
                              />
                              <HierarchyButtonGroup/>
                              <div
                                  className={'hierarchy-divider'}
                              />
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
