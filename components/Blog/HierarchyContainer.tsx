import React, { CSSProperties } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from './Overlay/HierarchyContextMenu'
import { DragIndicator } from './Overlay/DragIndicator'
import { HierarchyComponent } from './HierarchyComponent'
import { HierarchyName } from './HierarchyName'
import { HierarchyOnOffButton } from './HierarchyOnOffButton'
import UserManager from '../../manager/global/User/UserManager'
import StyleManager from '../../manager/global/Style/StyleManager'
import { BlogButtonGroupComponent } from './ControlButton/BlogButtonGroupComponent'
import { BrowserView, isBrowser, MobileView } from 'react-device-detect'
import { HierarchyOptionDrawer } from './HierarchyOptionDrawer/HierarchyOptionDrawer'
import Blog from '../../manager/global/Blog/Blog'
import { BlogOverlayComponent } from './Overlay/BlogOverlayComponent'
import { BlogNotificationOverlayComponent } from './Overlay/BlogNotificationOverlayComponent'
import GlobalManager from '../../manager/global/GlobalManager'

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

      const style: CSSProperties = {
          width: Blog.getBlogWidth(),
          top: isBrowser ? 56 : 0,
          left: isBrowser && UserManager.isUserAuthorized ? 64 : 0,
          height: GlobalManager.screenHeight - 56,
          zIndex: isBrowser ? 10 : 1000,
          position: isBrowser ? 'fixed' : 'absolute'
      }

      return (
          <>
              {/* <BrowserView> */}
              {/*     <HierarchyOnOffButton/> */}
              {/* </BrowserView> */}
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
                      Blog.pageHierarchy.contextMenu.open(null, null)
                  }}
                  open={isBrowser ? undefined : Blog.isOpen}
                  onClose={isBrowser
                      ? undefined
                      : () => {
                          Blog.isOpen = false
                      }}
                  style={style}
                  classes={classes}
              >
                  {
                      Blog.isOpen && <>
                          <HierarchyName/>
                          <BlogButtonGroupComponent/>
                          <HierarchyComponent/>
                          {
                              Blog.authority.editable && <>
                                  <HierarchyContextMenu/>
                                  <DragIndicator/>
                                  <BlogNotificationOverlayComponent/>
                              </>
                          }
                      </>
                  }
              </Drawer>
              <BlogOverlayComponent/>
          </>
      )
  })
