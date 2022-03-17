import { Transforms, Node, Location, NodeMatch } from 'slate'
import { fixContentNextHeaderWhenSplitNodes } from './FixHeadNextNormalTextPlugin'
// import HoveringToolbar from './HoveringToolbarPlugin'
import {
    TransformsSelectHandler,
    TransformsSetNodeHandler,
    TransformsSplitNodeHandler,
    TransformsTransformHandler
} from './types'
import UnknownPlugin from './UnknownPlugin'

const { transform, setNodes, select, splitNodes } = Transforms

// const transformsTransformHandler: TransformsTransformHandler[] = [
//     HoveringToolbar
// ]
// Transforms.transform = (editor, operation) => {
//     for (const handler of transformsTransformHandler) {
//         const handled = handler(editor, operation)
//         if (handled) {
//             return
//         }
//     }
//     transform(editor, operation)
// }

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

const transformsSplitNodeHandlers: TransformsSplitNodeHandler[] = [fixContentNextHeaderWhenSplitNodes]
Transforms.splitNodes = (editor, options) => {
    for (const handler of transformsSplitNodeHandlers) {
        const handled = handler(editor, options)
        if (handled) {
            return
        }
    }
    splitNodes(editor, options)
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
