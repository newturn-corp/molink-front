import { SourceType } from './InsertHTMLWhenInsertData'
import { TextCategory } from '../../../Types/slate/CustomElement'
import { jsx } from 'slate-hyperscript'
import { handleUnorderedList } from './handleUnorderedList'
import { handleOrderedList } from './handleOrderedList'
import { handleSpan } from './handleSpan'
import { handleFont } from './handleFont'
import { handleImage } from './handleImage'
import { handleLi } from './handleLi'
import { handleP } from './handleP'
import { handleHr } from './handleHr'
import { handleText } from './handleText'

const ELEMENT_TAGS = {
    A: el => ({ type: 'link', url: el.getAttribute('href') }),
    IMG: el => ({ type: 'image', url: el.getAttribute('src') }),
    LI: () => ({ type: 'list-item' }),
    OL: () => ({ type: 'numbered-list' }),
    P: () => ({ type: 'text', category: TextCategory.Content3 }),
    SPAN: () => ({ type: 'text', category: TextCategory.Content3 }),
    FONT: () => ({ type: 'text', category: TextCategory.Content3 }),
    PRE: () => ({ type: 'code' }),
    UL: () => ({ type: 'ul  -list' })
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

export class Deserializer {
    sourceType: SourceType
    isEnded: boolean = false
    fragmentCount: number = 0

    constructor (type: SourceType) {
        this.sourceType = type
    }

    getFragmentFromHTML (html) {
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        const fragment = this.deserialize(parsed.body)
        const remoteTarget = []
        for (let i = 0; i < fragment.length; i++) {
            const node = fragment[i]
            if (node.type === 'list-item') {
                for (let j = i; j >= 0; j--) {
                    const frontNode = fragment[j]
                    if (frontNode.type === 'ul-list' || frontNode.type === 'ol-list') {
                        frontNode.children.push(node)
                    }
                }
                remoteTarget.push(i)
            } else if (node.type === undefined) {
                if (node.text === '') {
                    remoteTarget.push(i)
                    continue
                }
                const prevNode = fragment[i - 1]
                const nextNode = fragment[i + 1]
                if (nextNode && ['ul-list', 'ol-list'].includes(nextNode.type)) {
                    fragment[i] = { type: 'text', category: TextCategory.Content3, children: [fragment[i]] }
                }
                if (prevNode && ['ul-list', 'ol-list'].includes(prevNode.type)) {
                    fragment[i] = { type: 'text', category: TextCategory.Content3, children: [fragment[i]] }
                }
            }
        }
        for (const index of remoteTarget.reverse()) {
            fragment.splice(index, 1)
        }
        return fragment
    }

    deserialize (el) {
        console.log(el)
        console.log(el.nodeType)
        console.log(this.fragmentCount)
        console.log(this.isEnded)

        if (this.isEnded) {
            return null
        }

        if (el.nodeType === 8) {
            if (this.sourceType === SourceType.Notion) {
                if (this.fragmentCount === 0) {
                    this.fragmentCount += 1
                } else {
                    this.isEnded = true
                }
            }
            return null
        }

        if (el.nodeType === 3) {
            return handleText(el, this.sourceType, this.fragmentCount)
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

        let children = Array.from(parent.childNodes)
            .map((child) => this.deserialize(child))
            .flat()

        if (children.length === 0) {
            children = [{ text: '' }]
        }

        if (el.nodeName === 'BODY') {
            return jsx('fragment', {}, children)
        }

        if (this.sourceType === SourceType.Notion && this.fragmentCount === 0) {
            return null
        }

        if (el.nodeName === 'DIV') {
            // if (el.parentNode.nodeName === 'BODY') {
            //     return jsx('fragment', {}, children)
            // }
            return jsx('fragment', {}, children)
        }

        if (nodeName === 'UL') {
            return handleUnorderedList(el, children)
        }

        if (nodeName === 'OL') {
            return handleOrderedList(el, children)
        }

        if (nodeName === 'SPAN') {
            return handleSpan(el, children)
        }

        if (nodeName === 'FONT') {
            return handleFont(el, children)
        }

        if (nodeName === 'IMG') {
            return handleImage(el, children)
        }

        if (nodeName === 'LI') {
            return handleLi(el, children)
        }

        if (['P'].includes(nodeName)) {
            return handleP(el, children)
        }

        if (nodeName === 'HR') {
            return handleHr(el, children)
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
}
