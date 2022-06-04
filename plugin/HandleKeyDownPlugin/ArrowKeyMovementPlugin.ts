import { Range, Transforms } from 'slate'

export const moveSelectionWhenArrowLeftDown = (event, editor) => {
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

    Transforms.move(editor, { unit: 'word', reverse: true })
}

export const moveSelectionWhenArrowRightDown = (event, editor) => {
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

    Transforms.move(editor, { unit: 'word', reverse: false })
}
