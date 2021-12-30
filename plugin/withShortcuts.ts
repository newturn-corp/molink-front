import {
    Range,
    Element as SlateElement,
    Editor as SlateEditor,
    Transforms,
    Point
} from 'slate'
import { BulletedListElement, OrderedListElement } from '../utils/slate'

const SHORTCUTS = {
    '*': 'list-item',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six',
    '```': 'code',
    '1.': 'ordered-list-item',
    '2.': 'ordered-list-item',
    '3.': 'ordered-list-item',
    '4.': 'ordered-list-item',
    '5.': 'ordered-list-item',
    '6.': 'ordered-list-item',
    '7.': 'ordered-list-item',
    '8.': 'ordered-list-item',
    '9.': 'ordered-list-item'
}

export const withShortcuts = editor => {
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
                const newProperties: Partial<SlateElement> = {
                    type
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n)
                })

                if (type === 'list-item') {
                    const list: BulletedListElement = {
                        type: 'ul-list',
                        children: []
                    }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !SlateEditor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                        n.type === 'list-item'
                    })
                }

                if (type === 'ordered-list-item') {
                    const list: OrderedListElement = {
                        type: 'ol-list',
                        children: []
                    }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !SlateEditor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                        n.type === 'ordered-list-item'
                    })
                }

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
                    const newProperties: Partial<SlateElement> = {
                        type: 'text'
                    }
                    Transforms.setNodes(editor, newProperties)

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !SlateEditor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                n.type === 'ul-list',
                            split: true
                        })
                    } else if (block.type === 'ordered-list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !SlateEditor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                n.type === 'ol-list',
                            split: true
                        })
                    }

                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}
