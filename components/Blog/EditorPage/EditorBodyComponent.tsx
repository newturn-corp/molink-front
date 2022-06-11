import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useRef } from 'react'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../manager/global/Blog/Blog'

export const EditorBodyComponent: React.FC<{
}> = observer((props) => {
    const toolbar = EditorPage.editor.toolbar
    const getBodyStyle = () => {
        const blogWidth = Blog.getBlogWidth()
        if (!toolbar || !toolbar.enable) {
            const top = 40
            return {
                width: window.innerWidth - blogWidth,
                height: window.innerHeight - top,
                top
            }
        } else {
            const top = toolbar.isOpen ? 130 : 80
            return {
                width: window.innerWidth - blogWidth,
                height: window.innerHeight - top,
                top
            }
        }
    }

    return <div
        className={'content-body'}
        style={getBodyStyle()}
    >
        {props.children}
    </div>
})
