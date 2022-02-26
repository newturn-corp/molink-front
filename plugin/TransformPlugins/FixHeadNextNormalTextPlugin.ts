import { Descendant, Editor, Node, Operation, Text } from 'slate'
import { TextCategory, TextElement } from '../../Types/slate/CustomElement'
import { createDraft, finishDraft, isDraft } from 'immer'

/**
 * 이 플러그인은 Head로 선언된 ELement에서 Enter를 쳐서
 * 새로운 라인을 만들 때, 같은 HeadElement가 아닌
 * ContentElement를 만들도록 합니다.
 * @param editor
 * @returns
 */
export default (editor: Editor, op: Operation) => {
    // 이 함수는 split_node 명령이 Head1, 2, 3일 때만 따로 수행함
    if (op.type !== 'split_node') {
        return false
    }
    const { path, position, properties } = op

    const node: any = Node.get(editor, path)

    if (![TextCategory.Head1, TextCategory.Head2, TextCategory.Head3].includes(node.category)) {
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
            } as TextElement
            newNode.category = TextCategory.Content3
        }

        parent.children.splice(index + 1, 0, newNode)

        if (selection) {
            // console.log('체크')
            // Transforms.select(editor, Range.points(selection))
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
