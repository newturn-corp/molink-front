import {
    Range,
    Element as SlateElement,
    Editor as SlateEditor,
    Transforms,
    Point,
    Editor
} from 'slate'
import { BulletedListElement, OrderedListElement } from '../utils/slate'
import { ListEditor, ListTransforms } from './ListPlugin'

const SHORTCUTS = {
    '*': 'unordered-list',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six',
    '```': 'code',
    '1.': 'ol-list',
    '2.': 'ol-list',
    '3.': 'ol-list',
    '4.': 'ol-list',
    '5.': 'ol-list',
    '6.': 'ol-list',
    '7.': 'ol-list',
    '8.': 'ol-list',
    '9.': 'ol-list'
}

export const withShortcuts = (editor: Editor) => {
    const { deleteBackward, insertText } = editor

    editor.insertText = text => {
        const { selection } = editor

        // if (text === '`' && selection && Range.isCollapsed(selection)) {
        //     const { anchor } = selection
        //     const block = SlateEditor.above(editor, {
        //         match: n => SlateEditor.isBlock(editor, n)
        //     })
        //     const path = block ? block[1] : []
        //     const start = SlateEditor.start(editor, path)
        //     const range = { anchor, focus: start }
        //     const beforeText = SlateEditor.string(editor, range)
        //     if (beforeText === '``') {
        //         Transforms.select(editor, range)
        //         Transforms.delete(editor)
        //         const newProperties: Partial<SlateElement> = {
        //             type: 'code'
        //         }
        //         Transforms.setNodes<SlateElement>(editor, newProperties, {
        //             match: n => SlateEditor.isBlock(editor, n)
        //         })
        //         return
        //     }
        // }

        if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const block = SlateEditor.above(editor, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            const path = block ? block[1] : []
            const start = SlateEditor.start(editor, path)
            const range = { anchor, focus: start }
            const beforeText = SlateEditor.string(editor, range)
            const type = SHORTCUTS[beforeText]

            if (type) {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                if (type === 'unordered-list') {
                    ListTransforms.wrapInList(editor)
                    return
                } else if (type === 'ol-list') {
                    ListTransforms.wrapInList(editor, 'ol-list')
                    return
                }
                const newProperties: Partial<SlateElement> = {
                    type
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n)
                })
                return
            }
        }

        insertText(text)
    }

    editor.deleteBackward = (...args) => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            const match = SlateEditor.above(editor, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            if (match) {
                const [block, path] = match
                const start = SlateEditor.start(editor, path)
                if (
                    !SlateEditor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== 'text' &&
                    Point.equals(selection.anchor, start)
                ) {
                    if (block.type === 'list-item') {
                        ListTransforms.unwrapList(editor)
                    }
                    const newProperties: Partial<SlateElement> = {
                        type: 'text'
                    }
                    Transforms.setNodes(editor, newProperties)
                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}
