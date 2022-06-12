import { jsx } from 'slate-hyperscript'
import { TextCategory } from '../../../Types/slate/CustomElement'

// eslint-disable-next-line no-undef
const shouldReturnText = (el: HTMLElement, children: any) => {
    const { parentNode, previousSibling } = el
    if (['STRONG', 'B', 'CODE', 'I', 'EM', 'SPAN'].includes(parentNode.nodeName)) {
        return true
    } else if (Array.isArray(children) && children.filter(child => typeof child !== 'string').length === 0) {
        return true
    }

    if (!previousSibling) {
        return false
    }

    if (previousSibling.nodeName === 'A') {
        return shouldReturnText(previousSibling as HTMLElement, previousSibling.childNodes)
    } else if (previousSibling.nodeName === 'SPAN') {
        return true
    }

    if (parentNode.nodeName === 'BODY') {
        return false
    } else {
        return true
    }
}

export const handleSpan = (el: HTMLElement, children: any) => {
    if (shouldReturnText(el, children)) {
        return el.textContent
    } else {
        return jsx('element', ({ type: 'text', category: TextCategory.Content3 }), children)
    }
}
