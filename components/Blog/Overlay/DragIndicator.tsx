import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'
import Blog from '../../../manager/global/Blog/Blog'

export const DragIndicator: React.FC<{
  }> = observer(() => {
      const pageHierarchy = Blog.pageHierarchy
      const pageDragManager = pageHierarchy.pageDragManager
      const tooltipRef = useRef<HTMLDivElement>(null)
      const indicatorRef = useRef<HTMLDivElement>(null)
      useEffect(() => {
          if (!pageDragManager || !indicatorRef) {
              return
          }
          pageDragManager.indicatorTooltip = document.getElementsByClassName('drag-indicator-tooltip')[0] as HTMLElement
          pageDragManager.dragIndicator = indicatorRef.current
      }, [pageDragManager, indicatorRef])

      if (!pageDragManager) {
          return <></>
      }

      return (
          <Tooltip
              ref={tooltipRef}
              id={'page-drag-tooltip'}
              placement="right"
              title={pageDragManager.viewerText}
              visible={true}
              overlayClassName={'drag-indicator-tooltip'}
          >
              <div
                  ref={indicatorRef}
                  id={'page-drag-indicator'}
                  className='drag-indicator'
              >
              </div>
          </Tooltip>
      )
  })
