import { TextCategory } from '../../../Types/slate/CustomElement'
import { jsx } from 'slate-hyperscript'

export const handleP = (el: HTMLElement, children: any) => {
    if (children.length === 1 && children[0].type === 'image') {
        return jsx('fragment', {}, children)
    }

    return jsx('element',
        ({ type: 'text', category: TextCategory.Content3 }),
        children
    )
}
