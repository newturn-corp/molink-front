import React from 'react'
import { observer } from 'mobx-react'
import GlobalManager from '../../manager/global/GlobalManager'
import UserManager from '../../manager/global/User/UserManager'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import Blog from '../../manager/global/Blog/Blog'

export const BlogWidthController: React.FC<{
  }> = observer(() => {
      if (!Blog.pageHierarchy) {
          return <></>
      }
      const userBlogBarWidth = 64
      return (
          <>
              <div
                  className={'hierarchy-width-controller'}
                  style={{
                      left: Blog.getBlogWidth() + (UserManager.isUserAuthorized ? userBlogBarWidth : 0)
                  }}
                  onDrag={async () => {
                      const value = GlobalManager.mousePositionX
                      if (Math.round(value) % 3 !== 0) {
                          return
                      }
                      UserManager.setting.hierarchyWidth = value - userBlogBarWidth
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
