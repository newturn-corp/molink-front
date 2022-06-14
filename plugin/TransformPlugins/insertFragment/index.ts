import { Editor, Element, Node, NodeEntry, Path, Range, Text, Transforms } from 'slate'
import { TextInsertFragmentOptions } from 'slate/dist/transforms/text'

export const insertFragment = (
    editor: Editor,
    fragment: Node[],
    options: TextInsertFragmentOptions = {}
): void => {
    Editor.withoutNormalizing(editor, () => {
        const { hanging = false, voids = false } = options
        let { at = editor.selection } = options

        if (!fragment.length) {
            return
        }

        if (!at) {
            return
        } else if (Range.isRange(at)) {
            if (!hanging) {
                at = Editor.unhangRange(editor, at)
            }

            if (Range.isCollapsed(at)) {
                at = at.anchor
            } else {
                const [, end] = Range.edges(at)

                if (!voids && Editor.void(editor, { at: end })) {
                    return
                }

                const pointRef = Editor.pointRef(editor, end)
                Transforms.delete(editor, { at })
                at = pointRef.unref()!
            }
        } else if (Path.isPath(at)) {
            at = Editor.start(editor, at)
        }

        if (!voids && Editor.void(editor, { at })) {
            return
        }

        // If the insert point is at the edge of an inline node, move it outside
        // instead since it will need to be split otherwise.
        const inlineElementMatch = Editor.above(editor, {
            at,
            match: n => Editor.isInline(editor, n),
            mode: 'highest',
            voids
        })

        if (inlineElementMatch) {
            const [, inlinePath] = inlineElementMatch

            if (Editor.isEnd(editor, at, inlinePath)) {
                const after = Editor.after(editor, inlinePath)!
                at = after
            } else if (Editor.isStart(editor, at, inlinePath)) {
                const before = Editor.before(editor, inlinePath)!
                at = before
            }
        }

        const blockMatch = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n),
            at,
            voids
        })!
        const [, blockPath] = blockMatch
        const isBlockStart = Editor.isStart(editor, at, blockPath)
        const isBlockEnd = Editor.isEnd(editor, at, blockPath)
        const isBlockEmpty = isBlockStart && isBlockEnd
        const mergeStart = !isBlockStart || (isBlockStart && isBlockEnd)
        const mergeEnd = !isBlockEnd
        const [, firstPath] = Node.first({ children: fragment }, [])
        const [, lastPath] = Node.last({ children: fragment }, [])

        const matches: NodeEntry[] = []
        const matcher = ([n, p]: NodeEntry) => {
            const isRoot = p.length === 0
            if (isRoot) {
                return false
            }

            if (isBlockEmpty) {
                return true
            }

            if (
                mergeStart &&
                Path.isAncestor(p, firstPath) &&
                Element.isElement(n) &&
                !editor.isVoid(n) &&
                !editor.isInline(n)
            ) {
                return false
            }

            if (
                mergeEnd &&
                Path.isAncestor(p, lastPath) &&
                Element.isElement(n) &&
                !editor.isVoid(n) &&
                !editor.isInline(n)
            ) {
                return false
            }

            return true
        }

        for (const entry of Node.nodes(
            { children: fragment },
            { pass: matcher }
        )) {
            if (matcher(entry)) {
                matches.push(entry)
            }
        }

        const starts = []
        const middles = []
        const ends = []
        let starting = true
        let hasBlocks = false

        for (const [node] of matches) {
            if (Element.isElement(node) && !editor.isInline(node)) {
                starting = false
                hasBlocks = true
                middles.push(node)
            } else if (starting) {
                starts.push(node)
            } else {
                ends.push(node)
            }
        }

        const [inlineMatch] = Editor.nodes(editor, {
            at,
            match: n => Text.isText(n) || Editor.isInline(editor, n),
            mode: 'highest',
            voids
        })!

        const [, inlinePath] = inlineMatch
        const isInlineStart = Editor.isStart(editor, at, inlinePath)
        const isInlineEnd = Editor.isEnd(editor, at, inlinePath)

        const middleRef = Editor.pathRef(
            editor,
            isBlockEnd ? Path.next(blockPath) : blockPath
        )

        const endRef = Editor.pathRef(
            editor,
            isInlineEnd ? Path.next(inlinePath) : inlinePath
        )

        const blockPathRef = Editor.pathRef(editor, blockPath)

        Transforms.splitNodes(editor, {
            at,
            match: n =>
                hasBlocks
                    ? Editor.isBlock(editor, n)
                    : Text.isText(n) || Editor.isInline(editor, n),
            mode: hasBlocks ? 'lowest' : 'highest',
            voids
        })

        const startRef = Editor.pathRef(
            editor,
            !isInlineStart || (isInlineStart && isInlineEnd)
                ? Path.next(inlinePath)
                : inlinePath
        )

        Transforms.insertNodes(editor, starts, {
            at: startRef.current!,
            match: n => Text.isText(n) || Editor.isInline(editor, n),
            mode: 'highest',
            voids
        })

        if (isBlockEmpty && middles.length) {
            Transforms.delete(editor, { at: blockPathRef.unref()!, voids })
        }

        Transforms.insertNodes(editor, middles, {
            at: middleRef.current!,
            match: n => Editor.isBlock(editor, n),
            mode: 'lowest',
            voids
        })

        Transforms.insertNodes(editor, ends, {
            at: endRef.current!,
            match: n => Text.isText(n) || Editor.isInline(editor, n),
            mode: 'highest',
            voids
        })

        if (!options.at) {
            let path
            if (ends.length > 0 && endRef.current) {
                path = Path.previous(endRef.current!)
            } else if (middles.length > 0 && middleRef.current) {
                path = Path.previous(middleRef.current!)
            } else {
                path = Path.previous(startRef.current!)
            }

            const end = Editor.end(editor, path)
            Transforms.select(editor, end)
        }

        startRef.unref()
        middleRef.unref()
        endRef.unref()
    })
}
