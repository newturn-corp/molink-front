import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useRef } from 'react'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../manager/global/Blog/Blog'
import GlobalManager from '../../../manager/global/GlobalManager'
import { isMobile } from 'react-device-detect'

export const EditorBodyComponent: React.FC<{
}> = observer((props) => {
    const toolbar = EditorPage.editor.toolbar
    const getBodyStyle = () => {
        const blogWidth = Blog.getBlogWidth()
        const screenWidth = GlobalManager.screenWidth || window.innerWidth
        const screenHeight = GlobalManager.screenHeight || window.innerHeight
        if (!toolbar || !toolbar.enable) {
            const top = 40
            return {
                width: screenWidth - (isMobile ? 0 : blogWidth),
                height: screenHeight - top,
                top
            }
        } else {
            const top = toolbar.isOpen ? 130 : 80
            return {
                width: screenWidth - (isMobile ? 0 : blogWidth),
                height: screenHeight - top,
                top
            }
        }
    }

    return <div
        className={'content-body'}
        id={'content-body'}
        style={getBodyStyle()}
    >
        {props.children}
    </div>
})
