import { EditListPlugin } from '@productboard/slate-edit-list'
const [
    withEditList,
    onDefaultKeyDown,
    { Transforms: ListTransforms, Editor: ListEditor }
] = EditListPlugin({
    types: ['ul-list', 'ol-list', 'check-list'],
    typeItem: 'list-item'
})

export { withEditList, ListTransforms, ListEditor }
