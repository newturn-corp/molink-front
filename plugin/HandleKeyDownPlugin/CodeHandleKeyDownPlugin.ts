import { Editor, Element, Node, Range, Text, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'
import { isMac } from 'lib0/environment'
import EditorPage from '../../manager/Blog/Editor/EditorPage'

const checkInsideIndependentBlock = (editor: Editor) => {
    const ancestors = Node.ancestors(editor, editor.selection.anchor.path)
    console.log(ancestors)
    for (const [ancestor] of ancestors) {
        if (Element.isElement(ancestor) && ['code', 'callout'].includes(ancestor.type)) {
            return true
        }
    }
    return false
}

export const handleEnterInCode = (event, editor) => {
    console.log('handleEnterInCode')
    if (isMac && EditorPage.editor.isComposing) {
        return false
    }
    if (!checkInsideIndependentBlock(editor)) {
        return false
    }
    event.preventDefault()
    editor.insertText('\n')
    return true
}

export const handleTabInCode = (event, editor) => {
    if (editor.children[editor.selection.anchor.path[0]].type !== 'code') {
        return false
    }
    event.preventDefault()
    editor.insertText('  ')
    return true
}

export const handleShiftEnterInCode = (event, editor) => {
    if (!checkInsideIndependentBlock(editor)) {
        return false
    }
    event.preventDefault()
    editor.insertBreak()
    Transforms.setNodes(editor, {
        type: 'text',
        category: TextCategory.Content3
    })
    Transforms.setNodes(
        editor,
        {
            codehighlight: false
        },
        {
            match: Text.isText,
            split: true
        }
    )
    return true
}

export const handleSpaceInCodeMark = (event, editor: Editor) => {
    const { selection } = editor
    if (!Range.isCollapsed(selection)) {
        return false
    }
    const currentNode = Node.get(editor, selection.anchor.path)
    if (currentNode.code) {
        const [start, end] = Range.edges(editor.selection)
        const endAtEndOfNode = Editor.isEnd(editor, end, end.path)
        if (endAtEndOfNode) {
            Transforms.insertNodes(editor, { text: ' ' })
            Transforms.move(editor, {
                distance: 1,
                unit: 'character',
                reverse: true
            })
            return true
        }
    }
    return false
}
