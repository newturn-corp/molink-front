import { observer } from 'mobx-react'
import React from 'react'
import { EditorComponent } from './EditorComponent'
import EditorManager from '../../../../manager/Home/EditorManager'

export const EditorContainer: React.FC<{
}> = observer(() => {
    if (!EditorManager.slateEditor) {
        return <></>
    }

    return <EditorComponent></EditorComponent>
})
