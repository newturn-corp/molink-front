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

export const ListTransforms = {
    isItem,
    splitListItem,
    unwrapList,
    wrapInList,
    decreaseItemDepth,
    increaseItemDepth
}

export const ListElement = {
    isItem,
    isList
}

export const ListEditor = {
    getCurrentItem,
    getTopmostItemsAtRange,
    getListForItem,
    getDeepestItemDepth,
    getItemDepth,
    getPreviousItem,
    isSelectionInList
}

export const ListOptions = options
