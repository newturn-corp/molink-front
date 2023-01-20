import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-undef
export const checkOrderedListIsAfterOtherList = (el: HTMLElement) => {
    const previousSibling = el.previousSibling
    if (!previousSibling) {
        return false
    }

    if (previousSibling.nodeName === 'DIV') {
        return checkOrderedListIsAfterOtherList(el.previousSibling as HTMLElement)
    } else if (previousSibling.nodeName === 'UL') {
        return true
    } else {
        return false
    }
}

export const handleOrderedList = (el: HTMLElement, children: any) => {
    if (checkOrderedListIsAfterOtherList(el)) {
        return jsx('element', {
            type: 'ordered-list-item'
        }, children)
    }
    return jsx('element', {
        type: 'ol-list',
        start: 1
    }, children)
}
