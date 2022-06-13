import { Editor as SlateEditor, Element as SlateElement, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

export const handleHead1Shortcut = (event, editor) => {
    event.preventDefault()
    Transforms.setNodes<SlateElement>(editor, {
        category: TextCategory.Head1
    }, {
        match: n => SlateEditor.isBlock(editor, n)
    })
    return true
}

export const handleHead2Shortcut = (event, editor) => {
    event.preventDefault()
    Transforms.setNodes<SlateElement>(editor, {
        category: TextCategory.Head2
    }, {
        match: n => SlateEditor.isBlock(editor, n)
    })
    return true
}

export const handleHead3Shortcut = (event, editor) => {
    event.preventDefault()
    Transforms.setNodes<SlateElement>(editor, {
        category: TextCategory.Head3
    }, {
        match: n => SlateEditor.isBlock(editor, n)
    })
    return true
}
