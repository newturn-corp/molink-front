import React from 'react'
import { observer } from 'mobx-react'
import { BlogHierarchyComponent } from './BlogHierarchyComponent'
import { BlogName } from './BlogName'
import { BlogButtonGroupComponent } from './ControlButton/BlogButtonGroupComponent'
import Blog from '../../manager/global/Blog/Blog'
import { BlogOverlayComponent } from './Overlay/BlogOverlayComponent'
import { BlogDrawer } from './BlogDrawer'
import { DragIndicator } from './Overlay/DragIndicator'
import { HierarchyContextMenu } from './Overlay/HierarchyContextMenu'

export const BlogComponent: React.FC<{
  }> = observer(() => {
      if (!Blog.pageHierarchy) {
          return <></>
      }

      return (
          <>
              <BlogDrawer>
                  {
                      Blog.isOpen && <>
                          <BlogName/>
                          {
                              Blog.authority?.editable && <>
                                  <BlogButtonGroupComponent/>
                              </>
                          }
                          <BlogHierarchyComponent/>
                      </>
                  }
                  {
                      Blog.isOpen && Blog.authority.editable && <>
                          <DragIndicator/>
                          <HierarchyContextMenu/>
                      </>
                  }
              </BlogDrawer>
              <BlogOverlayComponent/>
          </>
      )
  })
