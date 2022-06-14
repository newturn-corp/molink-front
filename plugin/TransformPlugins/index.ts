import { Transforms, Node, Location, NodeMatch } from 'slate'
import { fixContentNextHeaderWhenSplitNodes } from './FixHeadNextNormalTextPlugin'
import {
    TransformsSetNodeHandler,
    TransformsSplitNodeHandler
} from './types'
import UnknownPlugin from './UnknownPlugin'
import { customDelete } from './delete'
import { customInsertNode } from './insertNode'
import { customRemoveNodes } from './removeNodes'
import { customSelect } from './select'
import { move } from './move'
import { insertFragment } from './insertFragment'

const { setNodes, select, splitNodes } = Transforms

Transforms.delete = customDelete
Transforms.insertNodes = customInsertNode
Transforms.removeNodes = customRemoveNodes
Transforms.select = customSelect
Transforms.move = move
Transforms.insertFragment = insertFragment

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
