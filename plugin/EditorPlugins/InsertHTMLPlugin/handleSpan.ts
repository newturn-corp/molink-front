import { jsx } from 'slate-hyperscript'
import { TextCategory } from '../../../Types/slate/CustomElement'

// eslint-disable-next-line no-undef
const shouldReturnText = (el: HTMLElement, prevSibling: ChildNode) => {
    if (!prevSibling) {
        return false
    }

    if (prevSibling.nodeName === 'A') {
        console.log('여기 호출')
        return shouldReturnText(el, prevSibling.previousSibling)
    } else if (prevSibling.nodeName === 'SPAN') {
        return true
    }

    if (el.parentNode.nodeName === 'BODY') {
        return false
    } else {
        return true
    }
}

export const handleSpan = (el: HTMLElement, children: any) => {
    // if (shouldReturnText(el, el.previousSibling)) {
    //     return el.textContent
    // } else {
    //     return jsx('element', ({ type: 'text', category: TextCategory.Content3 }), children)
    // }
    return el.textContent
}
