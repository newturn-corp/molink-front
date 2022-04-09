import { Transforms, Node, Location, NodeMatch, Editor, Path, Range, Point, NodeEntry } from 'slate'
import { fixContentNextHeaderWhenSplitNodes } from './FixHeadNextNormalTextPlugin'
// import HoveringToolbar from './HoveringToolbarPlugin'
import {
    TransformsRemoveNodesHandler,
    TransformsSelectHandler,
    TransformsSetNodeHandler,
    TransformsSplitNodeHandler,
    TransformsTransformHandler
} from './types'
import UnknownPlugin from './UnknownPlugin'
import FormattingManager from '../../manager/Editing/FormattingManager'
import { customDelete } from './delete'
import { customInsertNode } from './insertNode'
import { customRemoveNodes } from './removeNodes'
import { customSelect } from './select'
import { move } from './move'

const { setNodes, select, splitNodes } = Transforms

Transforms.delete = customDelete
Transforms.insertNodes = customInsertNode
Transforms.removeNodes = customRemoveNodes
Transforms.select = customSelect
Transforms.move = move

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
const afterTransformsSplitNodeHandlers: TransformsSplitNodeHandler[] = []
Transforms.splitNodes = (editor, options) => {
    for (const handler of transformsSplitNodeHandlers) {
        const handled = handler(editor, options)
        if (handled) {
            return
        }
    }
    splitNodes(editor, options)
    for (const handler of afterTransformsSplitNodeHandlers) {
        handler(editor, options)
    }
}

// const transformsSelectHandler: TransformsSelectHandler[] = []
// const afterTransformsSelectHandler: TransformsSelectHandler[] = [
//     (editor, location) => FormattingManager.handleSelect()
// ]
