import { Editor, Node, Path, Range } from 'slate'

export const handleEnterInVoid = (event, editor) => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
        return false
    }
    const selectedNodePath = Path.parent(editor.selection.anchor.path)
    const selectedNode = Node.get(editor, selectedNodePath)
    if (Editor.isVoid(editor, selectedNode)) {
        event.preventDefault()
        editor.insertBreak()
        return true
    }
}
