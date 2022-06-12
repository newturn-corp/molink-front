import { TransformsSplitNodeHandler } from './types'
import {
    Editor as SlateEditor,
    Editor,
    Element as SlateElement,
    Element,
    Node,
    Path,
    Point,
    Range, Text,
    Transforms
} from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

const deleteRange = (editor: Editor, range: Range): Point | null => {
    if (Range.isCollapsed(range)) {
        return range.anchor
    } else {
        const [, end] = Range.edges(range)
        const pointRef = Editor.pointRef(editor, end)
        Transforms.delete(editor, { at: range })
        return pointRef.unref()
    }
}

export const fixContentNextHeaderWhenSplitNodes: TransformsSplitNodeHandler = (editor, options) => {
    Editor.withoutNormalizing(editor, () => {
        const { mode = 'lowest', voids = false } = options
        let { match, at = editor.selection, height = 0, always = false } = options

        if (match == null) {
            match = n => Editor.isBlock(editor, n)
        }

        if (Range.isRange(at)) {
            at = deleteRange(editor, at)
        }

        // If the target is a path, the default height-skipping and position
        // counters need to account for us potentially splitting at a non-leaf.
        if (Path.isPath(at)) {
            const path = at
            const point = Editor.point(editor, path)
            const [parent] = Editor.parent(editor, path)
            match = n => n === parent
            height = point.path.length - path.length + 1
            at = point
            always = true
        }

        if (!at) {
            return false
        }

        const beforeRef = Editor.pointRef(editor, at, {
            affinity: 'backward'
        })
        const [highest] = Editor.nodes(editor, { at, match, mode, voids })

        if (!highest) {
            return false
        }

        const voidMatch = Editor.void(editor, { at, mode: 'highest' })
        const nudge = 0

        if (!voids && voidMatch) {
            const [voidNode, voidPath] = voidMatch

            if (Element.isElement(voidNode) && editor.isInline(voidNode)) {
                let after = Editor.after(editor, voidPath)

                if (!after) {
                    const text = { text: '' }
                    const afterPath = Path.next(voidPath)
                    Transforms.insertNodes(editor, text, { at: afterPath, voids })
                    after = Editor.point(editor, afterPath)!
                }

                at = after
                always = true
            }

            const siblingHeight = at.path.length - voidPath.length
            height = siblingHeight + 1
            always = true
        }

        const afterRef = Editor.pointRef(editor, at)
        const depth = at.path.length - height
        const [, highestPath] = highest
        const lowestPath = at.path.slice(0, depth)
        let position = height === 0 ? at.offset : at.path[depth] + nudge

        for (const [node, path] of Editor.levels(editor, {
            at: lowestPath,
            reverse: true,
            voids
        })) {
            let split = false

            if (
                path.length < highestPath.length ||
                path.length === 0 ||
                (!voids && Editor.isVoid(editor, node))
            ) {
                break
            }

            const point = beforeRef.current!
            const isEnd = Editor.isEnd(editor, point, path)
            const isStart = Editor.isStart(editor, point, path)

            if (always || !beforeRef || !Editor.isEdge(editor, point, path)) {
                split = true
                const properties = Node.extractProps(node) as any
                if (Element.isElement(node)) {
                    if (properties.type === 'text' && [TextCategory.Head1, TextCategory.Head2, TextCategory.Head3].includes(properties.category)) {
                        if (isStart) {
                            Transforms.setNodes<SlateElement>(editor, {
                                type: 'text',
                                category: TextCategory.Content3
                            }, {
                                match: n => SlateEditor.isBlock(editor, n)
                            })
                            editor.apply({
                                type: 'split_node',
                                path,
                                position,
                                properties
                            })
                        } else {
                            editor.apply({
                                type: 'split_node',
                                path,
                                position,
                                properties: {
                                    type: 'text',
                                    category: TextCategory.Content3
                                }
                            })
                        }
                    } else if (properties.type === 'block-quote') {
                        editor.apply({
                            type: 'split_node',
                            path,
                            position,
                            properties: {
                                type: 'text',
                                category: TextCategory.Content3
                            }
                        })
                    } else {
                        editor.apply({
                            type: 'split_node',
                            path,
                            position,
                            properties
                        })
                    }
                } else if (Text.isText(node)) {
                    // properties.code = undefined
                    // properties.underlined = undefined
                    // properties.bold = undefined
                    // properties.italic = undefined
                    editor.apply({
                        type: 'split_node',
                        path,
                        position,
                        properties
                    })
                } else {
                    editor.apply({
                        type: 'split_node',
                        path,
                        position,
                        properties
                    })
                }
            }

            position = path[path.length - 1] + (split || isEnd ? 1 : 0)
        }

        if (options.at == null) {
            const point = afterRef.current || Editor.end(editor, [])
            Transforms.select(editor, point)
        }

        beforeRef.unref()
        afterRef.unref()
    })
    return true
}
