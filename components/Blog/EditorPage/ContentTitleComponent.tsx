import React from 'react'
import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../manager/global/Blog/Blog'

export const ContentTitleComponent: React.FC<{
}> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
    const openedPage = pageHierarchy.openedPage
    const editor = EditorPage.editor

    return (
        <div
            className='title'
            contentEditable={editor.editable && !editor.info.isLocked}
            suppressContentEditableWarning={true}
            style={{
                outline: '0px solid transparent',
                fontSize: isBrowser ? 40 : 32
            }}
            onBlur={(e) => {
                pageHierarchy.updatePageTitle(openedPage.pageId, e.currentTarget.textContent)
            }}
        >
            {openedPage.title}
        </div>
    )
})
