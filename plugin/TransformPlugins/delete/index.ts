import { Editor, NodeEntry, Path, Point, Range, Transforms, Node } from 'slate'
import { ListElement } from '../../GlobalPlugins'

export const customDelete = (editor: Editor, options: {
    at?: any
    distance?: number
    unit?: 'character' | 'word' | 'line' | 'block'
    reverse?: boolean
    hanging?: boolean
    voids?: boolean
} = {}) => {
    Editor.withoutNormalizing(editor, () => {
        const {
            reverse = false,
            unit = 'character',
            distance = 1,
            voids = false
        } = options
        let { at = editor.selection, hanging = false } = options

        if (!at) {
            return
        }

        if (Range.isRange(at) && Range.isCollapsed(at)) {
            at = at.anchor
        }

        if (Point.isPoint(at)) {
            const furthestVoid = Editor.void(editor, { at, mode: 'highest' })

            if (!voids && furthestVoid) {
                const [, voidPath] = furthestVoid
                at = voidPath
            } else {
                const opts = { unit, distance }
                const target = reverse
                    ? Editor.before(editor, at, opts) || Editor.start(editor, [])
                    : Editor.after(editor, at, opts) || Editor.end(editor, [])
                at = { anchor: at, focus: target }
                hanging = true
            }
        }

        if (Path.isPath(at)) {
            Transforms.removeNodes(editor, { at, voids })
            return
        }

        if (Range.isCollapsed(at)) {
            return
        }

        if (!hanging) {
            const [, end] = Range.edges(at)
            const endOfDoc = Editor.end(editor, [])

            if (!Point.equals(end, endOfDoc)) {
                at = Editor.unhangRange(editor, at, { voids })
            }
        }

        let [start, end] = Range.edges(at)
        const startBlock = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n),
            at: start,
            voids
        })
        const endBlock = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n),
            at: end,
            voids
        })
        const isAcrossBlocks =
            startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1])
        const isSingleText = Path.equals(start.path, end.path)
        const startVoid = voids
            ? null
            : Editor.void(editor, { at: start, mode: 'highest' })
        const endVoid = voids
            ? null
            : Editor.void(editor, { at: end, mode: 'highest' })

        // If the start or end points are inside an inline void, nudge them out.
        if (startVoid) {
            const before = Editor.before(editor, start)

            if (
                before &&
                startBlock &&
                Path.isAncestor(startBlock[1], before.path)
            ) {
                start = before
            }
        }

        if (endVoid) {
            const after = Editor.after(editor, end)

            if (after && endBlock && Path.isAncestor(endBlock[1], after.path)) {
                end = after
            }
        }

        // Get the highest nodes that are completely inside the range, as well as
        // the start and end nodes.
        const matches: NodeEntry[] = []
        let lastPath: Path | undefined

        for (const entry of Editor.nodes(editor, { at, voids })) {
            const [node, path] = entry

            if (lastPath && Path.compare(path, lastPath) === 0) {
                continue
            }

            if (
                (!voids && Editor.isVoid(editor, node)) ||
                (!Path.isCommon(path, start.path) && !Path.isCommon(path, end.path))
            ) {
                matches.push(entry)
                lastPath = path
            }
        }

        const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))
        const startRef = Editor.pointRef(editor, start)
        const endRef = Editor.pointRef(editor, end)

        if (!isSingleText && !startVoid) {
            const point = startRef.current!
            const [node] = Editor.leaf(editor, point)
            const { path } = point
            const { offset } = start
            const text = node.text.slice(offset)
            if (text.length > 0) {
                editor.apply({ type: 'remove_text', path, offset, text })
            }
        }

        for (const pathRef of pathRefs) {
            const path = pathRef.unref()!
            Transforms.removeNodes(editor, { at: path, voids })
        }

        if (!endVoid) {
            const point = endRef.current!
            const [node] = Editor.leaf(editor, point)
            const { path } = point
            const offset = isSingleText ? start.offset : 0
            const text = node.text.slice(offset, end.offset)
            if (text.length > 0) {
                editor.apply({ type: 'remove_text', path, offset, text })
            }
        }

        if (
            !isSingleText &&
            isAcrossBlocks &&
            endRef.current &&
            startRef.current
        ) {
            Transforms.mergeNodes(editor, {
                at: endRef.current,
                hanging: true,
                voids
            })
        }

        const point = reverse
            ? startRef.unref() || endRef.unref()
            : endRef.unref() || startRef.unref()

        if (options.at == null && point) {
            Transforms.select(editor, point)
        }

        // List 2개가 겹치는 경우 병합
        const currentNodePath = [editor.selection.anchor.path[0]]
        const currentNode = Node.get(editor, currentNodePath)
        if (currentNode && ListElement.isList(currentNode)) {
            const nextNodePath = [Path.next(currentNodePath)[0]]
            const nextNode = Node.get(editor, nextNodePath)
            if (nextNode && ListElement.isList(nextNode)) {
                Transforms.insertNodes(editor, nextNode.children, {
                    at: [currentNodePath[0], currentNode.children.length]
                })
                Transforms.delete(editor, { at: nextNodePath })
            }
        }
    })
}
