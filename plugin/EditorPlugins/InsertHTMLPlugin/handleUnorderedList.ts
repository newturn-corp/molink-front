import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-undef
export const checkUnorderedListIsAfterOtherList = (el: HTMLElement) => {
    const previousSibling = el.previousSibling
    if (!previousSibling) {
        return false
    }

    if (previousSibling.nodeName === 'DIV') {
        return checkUnorderedListIsAfterOtherList(el.previousSibling as HTMLElement)
    } else if (previousSibling.nodeName === 'UL') {
        return true
    } else {
        return false
    }
}

export const handleUnorderedList = (el: HTMLElement, children: any) => {
    if (checkUnorderedListIsAfterOtherList(el)) {
        return jsx('element', {
            type: 'list-item'
        }, children)
    }
    return jsx('element', {
        type: 'ul-list'
    }, children)
}
