import { SharedType, SyncElement, SyncNode } from 'slate-yjs'
import { Path, Point } from 'slate'
import invariant from 'tiny-invariant'
import * as Y from 'yjs'

export function getArrayPosition (item: Y.Item): number {
    let i = 0
    let c = (item.parent as Y.Array<SyncElement>)._start

    while (c !== item && c !== null) {
        if (!c.deleted) {
            i += 1
        }
        c = c.right
    }

    return i
}

export function getSyncNodePath (node: SyncNode): Path {
    if (!node) {
        return []
    }

    const { parent } = node
    if (!parent) {
        return []
    }

    if (parent instanceof Y.Array) {
        invariant(node._item, 'Parent should be associated with a item')
        return [...getSyncNodePath(parent), getArrayPosition(node._item)]
    }

    if (parent instanceof Y.Map) {
        return getSyncNodePath(parent)
    }

    throw new Error(`Unknown parent type ${parent}`)
}

export function relativePositionToAbsolutePosition (
    sharedType: SharedType,
    relativePosition: Y.RelativePosition
): Point | null {
    invariant(sharedType.doc, 'Shared type should be bound to a document')

    const pos = Y.createAbsolutePositionFromRelativePosition(
        relativePosition,
        sharedType.doc
    )

    if (!pos) {
        return null
    }

    return {
        path: getSyncNodePath(pos.type.parent as SyncNode),
        offset: pos.index
    }
}
