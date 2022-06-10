import { Editor, Range, Transforms } from 'slate'

export const moveSelectionWhenArrowLeftDown = (event, editor: Editor) => {
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
        return false
    }
    event.preventDefault()
    Transforms.move(editor, {
        unit: 'offset',
        reverse: true
    })
    return true
}

export const moveSelectionWhenCommandArrowLeftDown = (event, editor) => {
    event.preventDefault()
    const { selection } = editor
    if (selection && Range.isExpanded(selection)) {
        Transforms.collapse(editor, { edge: 'focus' })
    }

    Transforms.move(editor, { unit: 'line', reverse: true })
}

export const moveSelectionWhenArrowRightDown = (event, editor) => {
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
        return false
    }
    event.preventDefault()
    Transforms.move(editor, { unit: 'offset' })
    return true
}

export const moveSelectionWhenCommandArrowRightDown = (event, editor) => {
    event.preventDefault()
    const { selection } = editor
    if (selection && Range.isExpanded(selection)) {
        Transforms.collapse(editor, { edge: 'focus' })
    }

    Transforms.move(editor, { unit: 'line', reverse: false })
}
