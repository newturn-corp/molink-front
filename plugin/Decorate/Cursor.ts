import { BaseRange, Node, Path, Range, Text } from 'slate'
import EditorPage from '../../manager/Blog/Editor/EditorPage'

export const decorateCursor = (node: Node, path: Path, ranges: BaseRange[]) => {
    if (!Text.isText(node)) {
        return ranges
    }
    const synchronizer = EditorPage.editor.synchronizer
    if (!synchronizer) {
        return ranges
    }
    const cursors = synchronizer.cursors
    if (cursors.length === 0) {
        return ranges
    }
    cursors.forEach((cursor) => {
        if (Range.includes(cursor, path)) {
            const { focus, anchor, data } = cursor

            const isFocusNode = Path.equals(focus.path, path)
            const isAnchorNode = Path.equals(anchor.path, path)
            const isForward = Range.isForward({ anchor, focus })

            ranges.push({
                data,
                isForward,
                isCaret: isFocusNode,
                anchor: {
                    path,
                    // eslint-disable-next-line no-nested-ternary
                    offset: isAnchorNode
                        ? anchor.offset
                        : isForward
                            ? 0
                            : node.text.length
                },
                focus: {
                    path,
                    // eslint-disable-next-line no-nested-ternary
                    offset: isFocusNode
                        ? focus.offset
                        : isForward
                            ? node.text.length
                            : 0
                }
            } as any)
        }
    })
    return ranges
}
