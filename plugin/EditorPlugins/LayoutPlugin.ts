import {
    Transforms,
    Node,
    Element as SlateElement, Path, Editor
} from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

export const FixLayoutWhenNormalizeNode = (editor: Editor, [node, path]: [Node, Path]) => {
    if (path.length === 0) {
        for (const [child, childPath] of Node.children(editor, path)) {
            const slateIndex = childPath[0]
            switch (slateIndex) {
            case 0:
                if (SlateElement.isElement(child) && child.type !== 'title') {
                    const newProperties: Partial<SlateElement> = { type: 'title' }
                    Transforms.setNodes<SlateElement>(editor, newProperties, {
                        at: childPath
                    })
                }
                break
            case 1:
                if (SlateElement.isElement(child) && child.type === 'title') {
                    const newProperties: Partial<SlateElement> = { type: 'text', category: TextCategory.Content3 }
                    Transforms.setNodes<SlateElement>(editor, newProperties, {
                        at: childPath
                    })
                }
                break
            default:
                break
            }
        }
    }
    return false
}
