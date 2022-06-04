import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from './HierarchyContextMenu'
import { DragIndicator } from './DragIndicator'
import { HierarchyComponent } from './HierarchyComponent'
import { HierarchyName } from './HierarchyName'
import { HierarchyOnOffButton } from './HierarchyOnOffButton'
import UserManager from '../../../manager/global/User/UserManager'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { HierarchyButtonGroup } from './HierarchyButtonGroup'
import { BrowserView, isBrowser, MobileView } from 'react-device-detect'
import { HierarchyOptionDrawer } from './HierarchyOptionDrawer/HierarchyOptionDrawer'
import Blog from '../../../manager/global/Blog/Blog'

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

      if (!Blog.pageHierarchy) {
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
                      Blog.pageHierarchy.contextMenu.open(null)
                  }}
                  open={isBrowser ? undefined : Blog.isOpen}
                  onClose={isBrowser
                      ? undefined
                      : () => {
                          Blog.isOpen = false
                      }}
                  style={StyleManager.hierarchyStyle.containerStyle}
                  classes={classes}
              >
                  {
                      Blog.isOpen && <>
                          <HierarchyName/>
                          <HierarchyButtonGroup/>
                          <HierarchyComponent/>
                          {
                              Blog.pageHierarchy.editable && <>
                                  <HierarchyContextMenu/>
                                  <DragIndicator/>
                              </>
                          }
                      </>
                  }

              </Drawer>
          </>
      )
  })
