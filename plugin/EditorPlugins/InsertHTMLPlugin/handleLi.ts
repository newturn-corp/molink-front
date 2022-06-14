import { jsx } from 'slate-hyperscript'
import { checkUnorderedListIsAfterOtherList } from './handleUnorderedList'

export const handleLi = (el: HTMLElement, children: any) => {
    if (el.parentNode) {
        if (el.parentNode.nodeName === 'UL') {
            if (checkUnorderedListIsAfterOtherList(el.parentNode as HTMLElement)) {
                return jsx('fragment',
                    {},
                    children
                )
            }
        }
    }
    return jsx('element',
        ({ type: 'list-item' }),
        children
    )
}
