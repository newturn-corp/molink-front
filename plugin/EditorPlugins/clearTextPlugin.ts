import { Editor, Node, Range, Text, Transforms } from 'slate'

export const clearTextWhenInsertBreak = (editor: Editor) => {
    const [start, end] = Range.edges(editor.selection)
    const endAtEndOfNode = Editor.isEnd(editor, end, end.path)
    if (endAtEndOfNode) {
        Transforms.splitNodes(editor, { always: true })
        Transforms.setNodes(editor, {
            code: undefined,
            bold: undefined,
            underlined: undefined,
            italic: undefined
        }, {
            match: Text.isText
        })
        return true
    }
    return false
}
