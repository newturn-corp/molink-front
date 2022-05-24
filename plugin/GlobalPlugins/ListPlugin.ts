import { EditListPlugin } from '@productboard/slate-edit-list'
import { Editor, Element, Node, NodeEntry, Path, Range, Transforms } from 'slate'
import { unwrapList } from './List/transforms/unwrapList'
import { getItemDepth } from './List/editor/getItemDepth'
import { getCurrentItem } from './List/editor/getCurrentItem'
import { splitListItem } from './List/transforms/splitListItem'
import { isItem } from './List/transforms/isItem'
import { getTopmostItemsAtRange } from './List/editor/getTopmostItemsAtRange'
import { decreaseItemDepth } from './List/transforms/decreaseItemDepth'
import { getListForItem } from './List/editor/getListForItem'
import { getDeepestItemDepth } from './List/editor/getDeepestItemDepth'
import { getPreviousItem } from './List/editor/getPreviousItem'
import { increaseItemDepth } from './List/transforms/increaseItemDepth'

const options = {
    types: ['ul-list', 'ol-list', 'check-list'],
    typeItem: 'list-item'
}

const [
    withEditList,
    onDefaultKeyDown,
    { Transforms: ListTransforms, Editor: ListEditor, Element: ListElement }
] = EditListPlugin(options)

ListTransforms.isItem = isItem

ListElement.isItem = isItem

ListEditor.getCurrentItem = getCurrentItem
ListEditor.getTopmostItemsAtRange = getTopmostItemsAtRange
ListEditor.getListForItem = getListForItem
ListEditor.getDeepestItemDepth = getDeepestItemDepth
ListEditor.getItemDepth = getItemDepth
ListEditor.getPreviousItem = getPreviousItem

ListTransforms.splitListItem = splitListItem
ListTransforms.unwrapList = unwrapList
ListTransforms.decreaseItemDepth = decreaseItemDepth
ListTransforms.increaseItemDepth = increaseItemDepth

export { withEditList, ListTransforms, ListEditor, ListElement }
export const ListOptions = options
