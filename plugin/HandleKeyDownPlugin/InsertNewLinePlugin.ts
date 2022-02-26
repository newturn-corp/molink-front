import React from 'react'
import { Editor } from 'slate'

export const insertNewLineWhenShiftEnterKeyDown = (event: React.KeyboardEvent, editor: Editor) => {
    event.preventDefault()
    editor.insertText('\n')
    return true
}
