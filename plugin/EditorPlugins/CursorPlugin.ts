import { Editor, Path, Point } from 'slate'
import invariant from 'tiny-invariant'
import { Awareness } from 'y-protocols/awareness'
import { SharedType, SyncElement, SyncNode, toSlateDoc, YjsEditor } from 'slate-yjs'
import * as Y from 'yjs'
const AWARENESS: WeakMap<Editor, Awareness> = new WeakMap()

const isTree = (node: SyncNode): boolean => !!SyncNode.getChildren(node)

export function getTarget (doc: SharedType, path: Path): SyncNode {
    function iterate (current: SyncNode, idx: number) {
        const children = SyncNode.getChildren(current)

        if (!isTree(current) || !children?.get(idx)) {
            throw new TypeError(
                `path ${path.toString()} does not match doc ${JSON.stringify(
                    toSlateDoc(doc)
                )}`
            )
        }

        return children.get(idx)
    }

    return path.reduce<SyncNode>(iterate, doc)
}

export function absolutePositionToRelativePosition (
    sharedType: SharedType,
    point: Point
): Y.RelativePosition {
    const target = getTarget(sharedType, point.path)
    const text = SyncElement.getText(target as SyncElement)
    invariant(text, 'Slate point should point to Text node')
    return Y.createRelativePositionFromTypeIndex(text, point.offset)
}

export interface CursorEditorInterface extends YjsEditor {
    awareness: Awareness;
}

export const CursorEditor = {
    awareness (editor: CursorEditorInterface): Awareness {
        const awareness = AWARENESS.get(editor)
        invariant(awareness, 'CursorEditor without attaches awareness')
        return awareness
    },

    updateCursor: (editor: CursorEditorInterface): void => {
        const sharedType = YjsEditor.sharedType(editor)
        const { selection } = editor as Editor

        const anchor =
            selection &&
            absolutePositionToRelativePosition(sharedType, selection.anchor)

        const focus =
            selection &&
            absolutePositionToRelativePosition(sharedType, selection.focus)

        const awareness = CursorEditor.awareness(editor)
        // setLocalState(awareness, { ...awareness.getLocalState(), anchor, focus })
        awareness.setLocalState({ ...awareness.getLocalState(), anchor, focus })
    }
}
