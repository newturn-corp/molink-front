import { InsertDataHandler } from './types'
import { Editor, Element, Node, Path, Text } from 'slate'

export const insertCodeWhenInsertData: InsertDataHandler = (editor: Editor, data: DataTransfer) => {
    const text = data.getData('text/plain')
    if (!text || text === '') {
        return false
    }
    const { selection } = editor
    const node = Node.parent(editor, selection.focus.path)
    if (!Editor.isBlock(editor, node)) {
        return false
    }
    if (node.type !== 'code') {
        return false
    }
    editor.insertText(text)
    return true
}
