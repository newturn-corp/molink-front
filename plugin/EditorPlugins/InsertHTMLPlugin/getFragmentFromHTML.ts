import { deserialize } from './InsertHTMLWhenInsertData'
import { TextCategory } from '../../../Types/slate/CustomElement'

export const getFragmentFromHTML = (html: string) => {
    const parsed = new DOMParser().parseFromString(html, 'text/html')
    const fragment = deserialize(parsed.body)
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
