import React from 'react'
import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../manager/global/Blog/Blog'

export const ContentTitleComponent: React.FC<{
}> = observer(() => {
    const editor = EditorPage.editor
    const editorInfo = editor.info
    console.log(editorInfo)
    return (
        <div
            className='title'
            contentEditable={editor.editable && !editor.info.isLocked}
            suppressContentEditableWarning={true}
            style={{
                outline: '0px solid transparent',
                fontSize: isBrowser ? 40 : 32
            }}
            onBlur={async (e) => {
                await editorInfo.updateTitle(e.currentTarget.textContent)
            }}
        >
            {editorInfo.title}
        </div>
    )
})
