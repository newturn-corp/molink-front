import { Editor, Node, Range, Transforms } from 'slate'
import React from 'react'
import { TextCategory } from '../../Types/slate/CustomElement'
import { ListEditor, ListTransforms } from '../GlobalPlugins/ListPlugin'

const onEnter = (editor: Editor, event: React.KeyboardEvent<HTMLDivElement>) => {
    const isShiftPressed = event.shiftKey
    const currentItem = ListEditor.getCurrentItem(editor)

    if (isShiftPressed || !currentItem) {
        return
    }

    const [currentItemNode] = currentItem

    event.preventDefault()

    editor.deleteFragment()

    if (
        !Editor.isVoid(editor, currentItemNode) &&
        Node.string(currentItemNode) === ''
    ) {
        // Block is empty, we exit the list
        if (ListEditor.getItemDepth(editor) > 1) {
            ListTransforms.decreaseItemDepth(editor)
        } else {
            // Exit list
            ListTransforms.unwrapList(editor)
        }
    } else {
        // Split list item
        ListTransforms.splitListItem(editor)
    }
}

const onTab = (editor: Editor, event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (
        Range.isExpanded(editor.selection) ||
        !ListEditor.getCurrentItem(editor)
    ) {
        return
    }

    event.preventDefault()

    // Shift+tab reduce depth
    if (event.shiftKey) {
        ListTransforms.decreaseItemDepth(editor)
    } else {
        // Tab increases depth
        ListTransforms.increaseItemDepth(editor)
    }
}

export const onBackspace = (editor: Editor, event: React.KeyboardEvent<HTMLDivElement>): void => {
    const { selection } = editor

    // skip if selection is not collapsed
    if (!Range.isCollapsed(selection)) {
        return
    }

    const currentItem = ListEditor.getCurrentItem(editor)
    // skip if not a list item
    // or the selection not at the absolute start of the item
    if (
        !currentItem ||
        !Editor.isStart(editor, Range.start(selection), currentItem[1])
    ) {
        return
    }

    event.preventDefault()
    const depth = ListEditor.getItemDepth(editor, selection.focus.path)
    for (let i = 0; i < depth - 1; i++) {
        ListTransforms.decreaseItemDepth(editor)
    }
    ListTransforms.unwrapList(editor)
    Transforms.setNodes(editor, {
        type: 'text',
        category: TextCategory.Content3
    })
}

const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'
const KEY_BACKSPACE = 'Backspace'

export const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
    switch (event.key) {
    case KEY_ENTER:
        onEnter(editor, event)
        break
    case KEY_TAB:
        onTab(editor, event)
        break
    case KEY_BACKSPACE:
        onBackspace(editor, event)
        break
    default:
        break
    }
}
