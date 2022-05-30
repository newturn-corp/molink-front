import {
    Range,
    Element as SlateElement,
    Editor as SlateEditor,
    Transforms,
    Point,
    Editor,
    Node, Element
} from 'slate'
import { ListEditor, ListTransforms } from '../GlobalPlugins/ListPlugin'
import { DeleteBackwardHandler } from './types'
import { AvailCodeLanguage, DividerType } from '../../Types/slate/CustomElement'
import ShortcutManager from '../../manager/Editing/ShortcutManager'

const SHORTCUTS = {
    '*': 'unordered-list',
    '-': 'unordered-list',
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

    const currentNode = editor.children[editor.selection.anchor.path[0]]

    // 만약 Code 엘리먼트 내부이면 무시한다.
    if (Element.isElement(currentNode) && currentNode.type === 'code') {
        return false
    }

    // 만약 Selection 이 중첩되어있지 않으면 무시한다.
    if (!(selection && Range.isCollapsed(selection))) {
        return false
    }

    // divider
    if (text === '-') {
        const { anchor } = selection
        const block = SlateEditor.above(editor, {
            match: n => SlateEditor.isBlock(editor, n)
        })
        const path = block ? block[1] : []
        const start = SlateEditor.start(editor, path)
        const range = { anchor, focus: start }
        const beforeText = SlateEditor.string(editor, range)
        if (beforeText === '--') {
            Transforms.select(editor, range)
            Transforms.delete(editor)
            const newProperties: Partial<SlateElement> = {
                type: 'divider',
                dividerType: DividerType.FaintLongLine
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            return true
        }
    }

    // code
    if (text === '`') {
        const { anchor } = selection
        const block = SlateEditor.above(editor, {
            match: n => SlateEditor.isBlock(editor, n)
        })
        const path = block ? block[1] : []
        const start = SlateEditor.start(editor, path)
        const range = { anchor, focus: start }
        const beforeText = SlateEditor.string(editor, range)
        if (beforeText === '``') {
            Transforms.select(editor, range)
            Transforms.delete(editor)
            const newProperties: Partial<SlateElement> = {
                type: 'code',
                language: AvailCodeLanguage.Javascript
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            Transforms.insertNodes(editor, {
                text: '',
                codehighlight: true,
                codeLanguage: AvailCodeLanguage.Javascript
            })
            return true
        }
    }

    if (text === ']') {
        const { anchor } = selection
        const block = SlateEditor.above(editor, {
            match: n => SlateEditor.isBlock(editor, n)
        })
        const path = block ? block[1] : []
        const start = SlateEditor.start(editor, path)
        const range = { anchor, focus: start }
        const beforeText = SlateEditor.string(editor, range)
        if (beforeText === '[') {
            Transforms.select(editor, range)
            Transforms.delete(editor)
            ListTransforms.wrapInList(editor, 'check-list')
            const newProperties: Partial<SlateElement> = {
                type: 'check-list-item',
                checked: false
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n) && n.type === 'list-item'
            })
            return true
        }
    }

    if (text === ' ') {
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
            if (type === 'unordered-list' || type === 'ol-list' || type === 'check-list') {
                // 이미 리스트 내부이면 처리하지 않는다.
                if (ListEditor.getCurrentItem(editor)) {
                    return false
                }
            }
            Transforms.select(editor, range)
            Transforms.delete(editor)
            if (type === 'unordered-list') {
                ListTransforms.wrapInList(editor)
                return true
            } else if (type === 'ol-list') {
                const start = beforeText.split('.')[0]
                ListTransforms.wrapInList(editor, 'ol-list', { start: Number(start) })
                return true
            } else if (type === 'check-list') {
                ListTransforms.wrapInList(editor, 'check-list')
                const newProperties: Partial<SlateElement> = {
                    type: 'check-list-item',
                    checked: false
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n) && n.type === 'list-item'
                })
                return true
            }
            const newProperties: Partial<SlateElement> = ShortcutManager.getPropertyByShortcut(beforeText)
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

    const currentNode = editor.children[editor.selection.anchor.path[0]]
    if (Element.isElement(currentNode) && ['code', 'image', 'video', 'file'].includes(currentNode.type)) {
        return false
    }

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
                if (block.type === 'list-item' || block.type === 'check-list-item') {
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
