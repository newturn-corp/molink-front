import { observer } from 'mobx-react'
import React from 'react'
import EditorManager from '../../../../manager/Blog/EditorManager'

export const ContentFooter: React.FC<{
}> = observer(() => {
    return <div
        className='content-footer'
        onClick={() => EditorManager.handleContentFooterClicked()}
    ></div>
})
