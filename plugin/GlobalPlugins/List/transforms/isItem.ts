import { Element, Node } from 'slate'

export const isItem = (node: Node): boolean => {
    return Element.isElement(node) && ['list-item', 'check-list-item', 'ordered-list-item'].includes(node.type)
}
