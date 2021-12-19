import { Descendant, Editor, Node, Operation, Point, Range, Text, Transforms } from 'slate'
import { TextCategory } from '../utils/slate'
import { createDraft, finishDraft, isDraft } from 'immer'

export const withHeadNextNormalText = (editor: Editor) => {
    const { transform } = Transforms
    Transforms.transform = (editor: Editor, op: Operation): void => {
        // 이 함수는 split_node 명령이 Head1, 2, 3일 때만 따로 수행함
        if (op.type !== 'split_node') {
            return transform(editor, op)
        }
        const { path, position, properties } = op

        const node: any = Node.get(editor, path)

        if (![TextCategory.Head1, TextCategory.Head2, TextCategory.Head3].includes(node.category)) {
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

            const node = Node.get(editor, path)
            const parent = Node.parent(editor, path)
            const index = path[path.length - 1]
            let newNode: Descendant

            if (Text.isText(node)) {
                const before = node.text.slice(0, position)
                const after = node.text.slice(position)
                node.text = before
                newNode = {
                    ...(properties as Partial<Text>),
                    text: after
                }
            } else {
                const before = node.children.slice(0, position)
                const after = node.children.slice(position)
                node.children = before

                newNode = {
                    ...(properties as Partial<Element>),
                    children: after
                }
                newNode.category = TextCategory.Content3
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

    // editor.apply = (operation) => {
    //     console.log(operation)
    //     return apply(operation)
    // }
    return editor
}
