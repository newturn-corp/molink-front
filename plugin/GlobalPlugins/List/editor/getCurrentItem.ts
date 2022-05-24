import { Editor, Node, Path } from 'slate'
import { ListTransforms } from '../../ListPlugin'

export const getCurrentItem = (
    editor: Editor,
    path?: Path
): any => {
    if (!path) {
        if (!editor.selection) return null;
        [, path] = Editor.first(editor, editor.selection)
    }

    const nodeOnPath = Node.get(editor, path)
    if (nodeOnPath && ListTransforms.isItem(nodeOnPath)) {
        return [nodeOnPath, path]
    }

    return (
        Editor.above(editor, {
            at: path,
            match: (node: Node) => ListTransforms.isItem(node),
            mode: 'lowest'
        }) || null
    )
}
