import { Transforms, Node, Location, NodeMatch } from 'slate'
import FixHeadNextNormalText from './FixHeadNextNormalTextPlugin'
import HoveringToolbar from './HoveringToolbarPlugin'
import { TransformsSelectHandler, TransformsSetNodeHandler, TransformsTransformHandler } from './types'
import UnknownPlugin from './UnknownPlugin'

const { transform, setNodes, select } = Transforms

const transformsTransformHandler: TransformsTransformHandler[] = [
    FixHeadNextNormalText,
    HoveringToolbar
]
Transforms.transform = (editor, operation) => {
    for (const handler of transformsTransformHandler) {
        const handled = handler(editor, operation)
        if (handled) {
            return
        }
    }
    transform(editor, operation)
}

const transformsSetNodeHandler: TransformsSetNodeHandler<Node>[] = [
    UnknownPlugin
]
Transforms.setNodes = (editor,
    props: Partial<Node>,
    options: {
        at?: Location
        match?: NodeMatch<Node>
        mode?: 'all' | 'highest' | 'lowest'
        hanging?: boolean
        split?: boolean
        voids?: boolean
    } = {}) => {
    for (const handler of transformsSetNodeHandler) {
        const handled = handler(editor, props, options)
        if (handled) {
            return
        }
    }
    setNodes(editor, props, options)
}

const transformsSelectHandler: TransformsSelectHandler[] = [
    // maintainScreenMargin
]
Transforms.select = (editor, location) => {
    for (const handler of transformsSelectHandler) {
        const handled = handler(editor, location)
        if (handled) {
            return
        }
    }
    select(editor, location)
}
