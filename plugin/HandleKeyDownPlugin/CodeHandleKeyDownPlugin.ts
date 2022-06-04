import { Editor, Element, Node, Text, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

const checkInsideIndependentBlock = (editor: Editor) => {
    const ancestors = Node.ancestors(editor, editor.selection.anchor.path)
    for (const [ancestor] of ancestors) {
        if (Element.isElement(ancestor) && ['code', 'callout'].includes(ancestor.type)) {
            return true
        }
    }
    return false
}

export const handleEnterInCode = (event, editor) => {
    if (!checkInsideIndependentBlock(editor)) {
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
    if (!checkInsideIndependentBlock(editor)) {
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
