import { Editor, Element, Node, Path, Range, Transforms } from 'slate'

export const handleDeleteBackwardAfterMedia = (editor: Editor, unit: 'character' | 'word' | 'line' | 'block') => {
    if (
        !editor.selection ||
        !Range.isCollapsed(editor.selection) ||
        editor.selection.anchor.offset !== 0
    ) {
        return false
    }
    const parentPath = Path.parent(editor.selection.anchor.path)

    if (Path.hasPrevious(parentPath)) {
        const prevNodePath = Path.previous(parentPath)
        const prevNode = Node.get(editor, prevNodePath)
        if (Element.isElement(prevNode) && ['file', 'image', 'video', 'bookmark'].includes(prevNode.type)) {
            Transforms.move(editor, {
                unit: 'offset',
                reverse: true
            })
            return true
        }
    }

    return false
}

export const handleDeleteForwardAfterMedia = (editor: Editor, unit: 'character' | 'word' | 'line' | 'block') => {
    if (
        !editor.selection ||
        !Range.isCollapsed(editor.selection)
    ) {
        return false
    }
    const parentPath = Path.parent(editor.selection.anchor.path)
    const nextNodePath = Path.next(parentPath)
    // 만약 다음 노드가 존재하지 않는다면
    if (nextNodePath[0] + 1 > editor.children.length) {
        return false
    }
    const currentNode = Node.get(editor, parentPath)
    const nextNode = Node.get(editor, nextNodePath)
    if (editor.selection.anchor.offset !== Node.string(currentNode).length) {
        return false
    }
    if (Element.isElement(nextNode) && ['file', 'image', 'video', 'bookmark'].includes(nextNode.type) && !(Element.isElement(currentNode) && ['file', 'image', 'video', 'bookmark'].includes(currentNode.type))) {
        return true
    }

    return false
}
