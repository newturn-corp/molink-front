import { Transforms } from 'slate'
import { jsx } from 'slate-hyperscript'
import { CustomElement, TextCategory } from '../../Types/slate/CustomElement'
import { Align } from '../../manager/Editing/FormattingManager'
import { handleSpan } from './InsertHTMLPlugin/handleSpan'

const ELEMENT_TAGS = {
    A: el => ({ type: 'link', url: el.getAttribute('href') }),
    BLOCKQUOTE: () => ({ type: 'quote' }),
    H1: () => ({ type: 'text', category: TextCategory.Head1 }),
    H2: () => ({ type: 'text', category: TextCategory.Head2 }),
    H3: () => ({ type: 'text', category: TextCategory.Head3 }),
    H4: () => ({ type: 'text', category: TextCategory.Content1 }),
    H5: () => ({ type: 'text', category: TextCategory.Content2 }),
    H6: () => ({ type: 'text', category: TextCategory.Content3 }),
    IMG: el => ({ type: 'image', url: el.getAttribute('src') }),
    LI: () => ({ type: 'list-item' }),
    OL: () => ({ type: 'numbered-list' }),
    P: () => ({ type: 'text', category: TextCategory.Content3 }),
    SPAN: () => ({ type: 'text', category: TextCategory.Content3 }),
    PRE: () => ({ type: 'code' }),
    UL: () => ({ type: 'ul-list' })
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    U: () => ({ underline: true })
}

export const deserialize = el => {
    if (el.nodeType === 3) {
        if (el.parentNode.nodeName === 'BODY') {
            return null
        }
        return el.textContent
    } else if (el.nodeType !== 1) {
        return null
    } else if (el.nodeName === 'BR') {
        return '\n'
    }

    const { nodeName } = el
    let parent = el
    if (
        nodeName === 'PRE' &&
        el.childNodes[0] &&
        el.childNodes[0].nodeName === 'CODE'
    ) {
        parent = el.childNodes[0]
    }
    console.log(parent.childNodes)
    let children = Array.from(parent.childNodes)
        .map(deserialize)
        .flat()

    if (children.length === 0) {
        children = [{ text: '' }]
    }

    if (el.nodeName === 'BODY') {
        return jsx('fragment', {}, children)
    }

    if (nodeName === 'UL') {
        return jsx('element', {
            type: 'ul-list'
        }, children)
    }

    if (nodeName === 'SPAN') {
        return handleSpan(el, children)
    }

    if (ELEMENT_TAGS[nodeName]) {
        const attrs = ELEMENT_TAGS[nodeName](el)
        return jsx('element', attrs, children)
    }

    if (TEXT_TAGS[nodeName]) {
        const attrs = TEXT_TAGS[nodeName](el)
        return children.map(child => jsx('text', attrs, child))
    }

    return children
}

export const insertHTMLWhenInsertData = (editor, data) => {
    const html = data.getData('text/html')

    if (html) {
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        console.log(parsed.body)
        const fragment = deserialize(parsed.body)
        console.log(fragment)
        Transforms.insertFragment(editor, fragment)
        return true
    }
    return false
}
