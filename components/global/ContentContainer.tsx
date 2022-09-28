import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import GlobalManager from '../../manager/global/GlobalManager'
import Blog from '../../manager/global/Blog/Blog'
import UserManager from '../../manager/global/User/UserManager'

const ContentContainer: React.FC<{
}> = observer((props) => {
    const userBlogBarWidth = UserManager.isUserAuthorized ? 64 : 0
    const blogWidth = Blog.getBlogWidth()
    const getContainerSize = useCallback(() => {
        if (!GlobalManager.window) {
            return 0
        }
        if (isBrowser) {
            return GlobalManager.screenWidth - blogWidth - userBlogBarWidth
        } else {
            return GlobalManager.screenWidth
        }
    }, [GlobalManager.screenWidth, GlobalManager.screenHeight, blogWidth, userBlogBarWidth])

    const style = {
        transform: isBrowser ? `translateX(${blogWidth + userBlogBarWidth}px)` : undefined,
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
