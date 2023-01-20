import { Editor, Element, Node, Path, Range, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

export const CorrectVoidBehaviorWhenDeleteBackward = (editor: Editor, unit: 'character' | 'word' | 'line' | 'block') => {
    console.log('CorrectVoidBehaviorWhenDeleteBackward')
    if (
        !editor.selection ||
        !Range.isCollapsed(editor.selection) ||
        editor.selection.anchor.offset !== 0
    ) {
        return false
    }
    const parentPath = Path.parent(editor.selection.anchor.path)
    const currentNode = Node.get(editor, parentPath)
    if (Element.isElement(currentNode) && currentNode.type === 'text' && [TextCategory.Head1, TextCategory.Head2, TextCategory.Head3].includes(currentNode.category)) {
        return false
    }

    const parentIsEmpty = Node.string(currentNode).length === 0

    if (parentIsEmpty && Path.hasPrevious(parentPath)) {
        const prevNodePath = Path.previous(parentPath)
        const prevNode = Node.get(editor, prevNodePath)
        if (Editor.isVoid(editor, prevNode)) {
            Transforms.removeNodes(editor)
            return true
        }
    }

    return false
}

export const CorrectVoidBehaviorWhenInsertBreak = (editor: Editor) => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
        return false
    }
    const selectedNodePath = Path.parent(editor.selection.anchor.path)
    const selectedNode = Node.get(editor, selectedNodePath)
    if (Editor.isVoid(editor, selectedNode)) {
        Editor.insertNode(editor, {
            type: 'text',
            category: TextCategory.Content3,
            children: [{ text: '' }]
        })
        return true
    }

    return false
}
