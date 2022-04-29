import { Element, Node } from 'slate'

class Serializer {
    serializePlainText (nodes: Node[]) {
        let result = ''
        let description = ''
        for (const node of nodes) {
            const nodeString = Node.string(node)
            if (nodeString === '') {
                continue
            }
            if (description === '') {
                description = nodeString
            }
            result += nodeString + '\n'
        }
        return { result, description }
    }
}
export default new Serializer()
