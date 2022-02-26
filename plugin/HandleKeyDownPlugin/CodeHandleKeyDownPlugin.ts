import { Text, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

export const handleEnterInCode = (event, editor) => {
    if (editor.children[editor.selection.anchor.path[0]].type !== 'code') {
        return false
    }
    event.preventDefault()
    editor.insertText('\n')
    return true
}

export const handleTabInCode = (event, editor) => {
    if (editor.children[editor.selection.anchor.path[0]].type !== 'code') {
        return false
    }
    event.preventDefault()
    editor.insertText('  ')
    return true
}

export const handleShiftEnterInCode = (event, editor) => {
    if (editor.children[editor.selection.anchor.path[0]].type !== 'code') {
        return false
    }
    event.preventDefault()
    editor.insertBreak()
    Transforms.setNodes(editor, {
        type: 'text',
        category: TextCategory.Content3
    })
    Transforms.setNodes(
        editor,
        {
            codehighlight: false
        },
        {
            match: Text.isText,
            split: true
        }
    )
    return true
}
