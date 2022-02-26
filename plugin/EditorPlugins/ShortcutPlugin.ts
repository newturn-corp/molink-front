import {
    Range,
    Element as SlateElement,
    Editor as SlateEditor,
    Transforms,
    Point,
    Editor,
    Node
} from 'slate'
import { ListTransforms } from '../GlobalPlugins/ListPlugin'
import { DeleteBackwardHandler } from './types'

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
    '9.': 'ol-list',
    ㅁ: 'check-list'
}

export const ShortcutWhenInsertText = (editor: Editor, text: string) => {
    const { selection } = editor

    if (text === '`' && selection && Range.isCollapsed(selection)) {
        const { anchor } = selection
        const block = SlateEditor.above(editor, {
            match: n => SlateEditor.isBlock(editor, n)
        })
        const path = block ? block[1] : []
        const start = SlateEditor.start(editor, path)
        const range = { anchor, focus: start }
        const beforeText = SlateEditor.string(editor, range)
        if (beforeText === '``') {
            console.log('나 호출')
            Transforms.select(editor, range)
            Transforms.delete(editor)
            const newProperties: Partial<SlateElement> = {
                type: 'code'
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            Transforms.insertNodes(editor, {
                text: '',
                codehighlight: true
            })
            return true
        }
    }

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
                return true
            } else if (type === 'ol-list') {
                ListTransforms.wrapInList(editor, 'ol-list')
                return true
            } else if (type === 'check-list') {
                const newProperties: Partial<SlateElement> = {
                    type: 'check-list-item',
                    checked: false
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n)
                })
                ListTransforms.wrapInList(editor, 'check-list')
                return
            }
            const newProperties: Partial<SlateElement> = {
                type
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            return true
        }
    }
    return false
}

export const ShortcutWhenDeleteBackward: DeleteBackwardHandler = (editor: Editor, unit) => {
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
                return true
            }
        }
    }
    return false
}
