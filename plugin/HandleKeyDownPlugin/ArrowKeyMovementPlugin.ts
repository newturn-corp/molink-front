import { Range, Transforms } from 'slate'

let isSelectionMovingLeft = false
let isSelectionMovingRight = false
export const moveSelectionWhenCommandArrowLeftDown = (event, editor) => {
    event.preventDefault()
    if (isSelectionMovingLeft) {
        return false
    }
    isSelectionMovingLeft = true
    setTimeout(() => {
        const { selection } = editor
        if (selection && Range.isExpanded(selection)) {
            Transforms.collapse(editor, { edge: 'focus' })
        }

        Transforms.move(editor, { unit: 'line', reverse: true })
        isSelectionMovingLeft = false
    }, 0)
    return true
}

export const moveSelectionWhenCommandArrowRightDown = (event, editor) => {
    event.preventDefault()
    if (isSelectionMovingRight) {
        return false
    }
    isSelectionMovingRight = true
    setTimeout(() => {
        const { selection } = editor
        if (selection && Range.isExpanded(selection)) {
            Transforms.collapse(editor, { edge: 'focus' })
        }

        Transforms.move(editor, { unit: 'line', reverse: false })
        isSelectionMovingRight = false
    }, 0)
    return true
}
