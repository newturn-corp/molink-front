import { Editor, Node, Operation, Range, Text } from 'slate'
import { createDraft, finishDraft, isDraft } from 'immer'

export default (editor: Editor, op: Operation): boolean => {
    if (op.type !== 'split_node') {
        return false
    }
    const { path, position } = op
    const node: Text = Node.get(editor, path) as Text
    if (!Text.isText(node)) {
        return false
    }
    if (!node.bold && !node.italic && !node.underlined) {
        return false
    }
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
        return false
    }
    editor.children = createDraft(editor.children)
    const selection = editor.selection && createDraft(editor.selection)

    try {
        if (path.length === 0) {
            throw new Error(
                `Cannot apply a "split_node" operation at path [${path}] because the root node cannot be split.`
            )
        }

        const parent = Node.parent(editor, path)
        const index = path[path.length - 1]

        const node = Node.get(editor, path) as Text
        const before = node.text.slice(0, position)
        const after = node.text.slice(position)
        node.text = before
        const newNode = {
            text: after
        }

        parent.children.splice(index + 1, 0, newNode)

        if (selection) {
            // for (const [point, key] of Range.points(selection)) {
            //     selection[key] = Point.transform(point, op)!
            // }
        }
    } finally {
        editor.children = finishDraft(editor.children)

        if (selection) {
            editor.selection = isDraft(selection)
                ? (finishDraft(selection))
                : selection
        } else {
            editor.selection = null
        }
    }
    return true
}
