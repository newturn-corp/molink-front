import { EditListPlugin } from '@productboard/slate-edit-list'
import { Element } from 'slate'
const [
    withEditList,
    onDefaultKeyDown,
    { Transforms: ListTransforms, Editor: ListEditor }
] = EditListPlugin({
    types: ['ul-list', 'ol-list', 'check-list'],
    typeItem: 'list-item'
})

ListTransforms.isItem = (node: Node): boolean => {
    console.log(node)
    return Element.isElement(node) && ['list-item', 'check-list-item'].includes(node.type)
}

export { withEditList, ListTransforms, ListEditor }
