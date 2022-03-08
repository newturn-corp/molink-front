import { Editor, Node, Path, Range, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

export const correctDeleteBackwardInHeader = (editor: Editor, unit: 'character' | 'word' | 'line' | 'block') => {
    if (
        !editor.selection ||
        !Range.isCollapsed(editor.selection) ||
        editor.selection.anchor.offset !== 0
    ) {
        return false
    }

    const parentPath = Path.parent(editor.selection.anchor.path)
    const parentNode = Node.get(editor, parentPath)
    if (parentNode && Editor.isBlock(editor, parentNode)) {
        if (parentNode.type === 'text' && [TextCategory.Head1, TextCategory.Head2, TextCategory.Head3].includes(parentNode.category)) {
            Transforms.setNodes(editor, {
                category: TextCategory.Content3
            }, {
                match: n => Editor.isBlock(editor, n)
            })
            return true
        }
    }
    return false
}
