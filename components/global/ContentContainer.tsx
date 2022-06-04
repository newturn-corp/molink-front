import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import GlobalManager from '../../manager/global/GlobalManager'
import Blog from '../../manager/global/Blog/Blog'

const ContentContainer: React.FC<{
}> = observer((props) => {
    const blogWidth = Blog.getBlogWidth()
    const getContainerSize = useCallback(() => {
        if (!GlobalManager.window) {
            return 0
        }
        if (isBrowser) {
            return GlobalManager.screenWidth - blogWidth
        } else {
            return GlobalManager.screenHeight
        }
    }, [GlobalManager.screenWidth, GlobalManager.screenHeight, blogWidth])

    const style = {
        transform: isBrowser ? `translateX(${blogWidth}px)` : undefined,
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
