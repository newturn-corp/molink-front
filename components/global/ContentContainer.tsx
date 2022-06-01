import React, { useCallback, useEffect } from 'react'

import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import HierarchyManager from '../../manager/global/Hierarchy/HierarchyManager'
import GlobalManager from '../../manager/global/GlobalManager'

const ContentContainer: React.FC<{
}> = observer((props) => {
    const hierarchyWidth = HierarchyManager.getHierarchyWidth()
    const getContainerSize = useCallback(() => {
        if (!GlobalManager.window) {
            return 0
        }
        if (isBrowser) {
            return GlobalManager.screenWidth - hierarchyWidth
        } else {
            return GlobalManager.screenHeight
        }
    }, [GlobalManager.screenWidth, GlobalManager.screenHeight, hierarchyWidth])

    const style = {
        transform: isBrowser ? `translateX(${hierarchyWidth}px)` : undefined,
        width: getContainerSize()
    }

    return <div
        className={'content-container'}
        style={style}
    >
        {props.children}
    </div>
})

export default ContentContainer
