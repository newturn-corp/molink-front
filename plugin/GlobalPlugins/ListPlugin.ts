import { EditListPlugin } from '@productboard/slate-edit-list'
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
import { isList } from './List/element/isList'
import { isSelectionInList } from './List/editor/isSelectionInList'
import { wrapInList } from './List/transforms/wrapInList'

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
ListElement.isList = isList

ListEditor.getCurrentItem = getCurrentItem
ListEditor.getTopmostItemsAtRange = getTopmostItemsAtRange
ListEditor.getListForItem = getListForItem
ListEditor.getDeepestItemDepth = getDeepestItemDepth
ListEditor.getItemDepth = getItemDepth
ListEditor.getPreviousItem = getPreviousItem
ListEditor.isSelectionInList = isSelectionInList

ListTransforms.splitListItem = splitListItem
ListTransforms.unwrapList = unwrapList
ListTransforms.wrapInList = wrapInList
ListTransforms.decreaseItemDepth = decreaseItemDepth
ListTransforms.increaseItemDepth = increaseItemDepth

export { withEditList, ListTransforms, ListEditor, ListElement }
export const ListOptions = options
