import { observer } from 'mobx-react'
import React from 'react'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const ContentFooter: React.FC<{
}> = observer(() => {
    return <div
        className='content-footer'
        onClick={() => EditorPage.editor.handleContentFooterClicked()}
    ></div>
})
