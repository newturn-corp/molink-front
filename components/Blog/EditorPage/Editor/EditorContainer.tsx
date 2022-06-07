import { observer } from 'mobx-react'
import React from 'react'
import { EditorComponent } from './EditorComponent'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const EditorContainer: React.FC<{
}> = observer(() => {
    if (!EditorPage.editor.slateEditor) {
        return <></>
    }

    return <EditorComponent/>
})
