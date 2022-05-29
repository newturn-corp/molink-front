import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-undef
const shouldReturnListItem = (el: HTMLElement, prevSibling: ChildNode) => {
    if (!prevSibling) {
        return false
    }

    if (prevSibling.nodeName === 'DIV') {
        return shouldReturnListItem(el, prevSibling.previousSibling)
    } else if (prevSibling.nodeName === 'UL') {
        return true
    } else {
        return false
    }
}

export const handleUnorderedList = (el: HTMLElement, children: any) => {
    if (shouldReturnListItem(el, el.previousSibling)) {
        return jsx('element', {
            type: 'list-item'
        }, children)
    }
    return jsx('element', {
        type: 'ul-list'
    }, children)
}
