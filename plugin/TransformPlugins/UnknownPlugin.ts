import { Editor, Element, Location, Node, NodeMatch, Path, Range, Transforms } from 'slate'
import UserManager from '../../manager/global/User/UserManager'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'

const matchPath = (editor: Editor, path: Path): ((node: Node) => boolean) => {
    const [node] = Editor.node(editor, path)
    return n => n === node
}

export default function<T extends Node> (
    editor: Editor,
    props: Partial<Node>,
    options: {
        at?: Location
        match?: NodeMatch<T>
        mode?: 'all' | 'highest' | 'lowest'
        hanging?: boolean
        split?: boolean
        voids?: boolean
    } = {}
) {
    Editor.withoutNormalizing(editor, () => {
        let { match, at = editor.selection } = options
        const {
            hanging = false,
            mode = 'lowest',
            split = false,
            voids = false
        } = options

        if (!at) {
            return
        }

        if (match == null) {
            match = Path.isPath(at)
                ? matchPath(editor, at)
                : n => Editor.isBlock(editor, n)
        }

        if (!hanging && Range.isRange(at)) {
            at = Editor.unhangRange(editor, at)
        }

        if (split && Range.isRange(at)) {
            if (
                Range.isCollapsed(at) &&
                Editor.leaf(editor, at.anchor)[0].text.length > 0
            ) {
                // If the range is collapsed in a non-empty node and 'split' is true, there's nothing to
                // set that won't get normalized away
                return
            }
            const rangeRef = Editor.rangeRef(editor, at, { affinity: 'inward' })
            const [start, end] = Range.edges(at)
            const splitMode = mode === 'lowest' ? 'lowest' : 'highest'
            const endAtEndOfNode = Editor.isEnd(editor, end, end.path)
            Transforms.splitNodes(editor, {
                at: end,
                match,
                mode: splitMode,
                voids,
                always: !endAtEndOfNode
            })
            const startAtStartOfNode = Editor.isStart(editor, start, start.path)
            Transforms.splitNodes(editor, {
                at: start,
                match,
                mode: splitMode,
                voids,
                always: !startAtStartOfNode
            })
            at = rangeRef.unref()!

            if (options.at == null) {
                Transforms.select(editor, at)
            }
        }

        for (const [node, path] of Editor.nodes(editor, {
            at,
            match,
            mode,
            voids
        })) {
            const properties: Partial<Node> = {}
            const newProperties: Partial<Node> = {}

            // You can't set properties on the editor node.
            if (path.length === 0) {
                continue
            }

            let hasChanges = false

            for (const k in props) {
                if (k === 'children' || k === 'text') {
                    continue
                }

                if (props[k] !== node[k]) {
                    hasChanges = true
                    // Omit new properties from the old properties list
                    // eslint-disable-next-line no-prototype-builtins
                    if (node.hasOwnProperty(k)) properties[k] = node[k]
                    // Omit properties that have been removed from the new properties list
                    if (props[k] != null) newProperties[k] = props[k]
                }
            }

            if (hasChanges) {
                if (Element.isElement(node) &&
                    (['file', 'image', 'video'].includes(node.type) ||
                    ['file', 'image', 'video'].includes((newProperties as any).type))) {
                    const newSize = (newProperties as any).size
                    const prevSize = (newProperties as any).size || 0
                    if (newSize) {
                        EventManager.issueEvent(Event.PageFileUsageChange, { usage: newSize - prevSize })
                    }
                }
                editor.apply({
                    type: 'set_node',
                    path,
                    properties,
                    newProperties
                })
            }
        }
    })
    return true
}
