import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'

export const DragIndicator: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const tooltipRef = useRef<HTMLDivElement>(null)
      const indicatorRef = useRef<HTMLDivElement>(null)
      useEffect(() => {
          if (currentHierarchy) {
              currentHierarchy.pageDragManager.indicatorTooltip = document.getElementsByClassName('drag-indicator-tooltip')[0] as HTMLElement
              currentHierarchy.pageDragManager.dragIndicator = indicatorRef.current
          }
      }, [currentHierarchy])

      return (
          <Tooltip
              ref={tooltipRef}
              id={'page-drag-tooltip'}
              placement="right"
              title={currentHierarchy && currentHierarchy.pageDragManager.viewerText}
              visible={true}
              overlayClassName={'drag-indicator-tooltip'}
          >
              <div
                  ref={indicatorRef}
                  id={'page-drag-indicator'}
                  className='drag-indicator'
                  // style={{
                  //     width: '240'
                  // }}
              >
              </div>
          </Tooltip>
      )
  })
