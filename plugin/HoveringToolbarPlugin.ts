import { Editor, Node, Operation, Point, Range, Text, Transforms } from 'slate'
import { createDraft, finishDraft, isDraft } from 'immer'

/**
 * 이 플러그인은 새로운 라인을 만들 때, 기존 라인이 일반 노드가 아니었다면
 * 새로운 라인을 일반 라인으로 만드는 플러그인입니다.
 * @param editor
 * @returns
 */
export const HoveringToolbarPlugin = (editor: Editor) => {
    const { transform } = Transforms
    Transforms.transform = (editor: Editor, op: Operation): void => {
        if (op.type !== 'split_node') {
            return transform(editor, op)
        }
        const { path, position } = op
        const node: Text = Node.get(editor, path) as Text
        if (!Text.isText(node)) {
            return transform(editor, op)
        }
        if (!node.bold && !node.italic && !node.underlined) {
            return transform(editor, op)
        }
        if (!editor.selection || !Range.isCollapsed(editor.selection)) {
            return transform(editor, op)
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
                for (const [point, key] of Range.points(selection)) {
                    selection[key] = Point.transform(point, op)!
                }
            }
        } finally {
            editor.children = finishDraft(editor.children)

            if (selection) {
                editor.selection = isDraft(selection)
                    ? (finishDraft(selection) as Range)
                    : selection
            } else {
                editor.selection = null
            }
        }
    }

    return editor
}
