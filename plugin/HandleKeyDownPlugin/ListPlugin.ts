import { Editor, Node, Range, Transforms } from 'slate'
import React from 'react'
import { TextCategory } from '../../Types/slate/CustomElement'
import { ListEditor, ListTransforms } from '../GlobalPlugins/ListPlugin'

export const handleEnterInList = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
    const currentItem = ListEditor.getCurrentItem(editor)
    if (!currentItem) {
        return false
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
    return true
}

export const handleTabInList = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
    if (
        Range.isExpanded(editor.selection) ||
        !ListEditor.getCurrentItem(editor)
    ) {
        return false
    }

    event.preventDefault()
    ListTransforms.increaseItemDepth(editor)
    return true
}

export const handleShiftTabInList = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
    if (
        Range.isExpanded(editor.selection) ||
        !ListEditor.getCurrentItem(editor)
    ) {
        return false
    }

    event.preventDefault()
    ListTransforms.decreaseItemDepth(editor)
    return true
}

export const handleBackspaceInList = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => {
    const { selection } = editor

    // skip if selection is not collapsed
    if (!Range.isCollapsed(selection)) {
        return false
    }

    const currentItem = ListEditor.getCurrentItem(editor)
    // skip if not a list item
    // or the selection not at the absolute start of the item
    if (
        !currentItem ||
        !Editor.isStart(editor, Range.start(selection), currentItem[1])
    ) {
        return false
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
    return true
}
