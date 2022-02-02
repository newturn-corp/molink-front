import { observer } from 'mobx-react'
import React from 'react'
import EditorManager from '../../../../manager/EditorManager'
import { EditorComponent } from './EditorComponent'

export const EditorContainer: React.FC<{
}> = observer(() => {
    if (!EditorManager.editor) {
        return <></>
    }

    return <EditorComponent></EditorComponent>
})
