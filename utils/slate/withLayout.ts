import {
    Transforms,
    Node,
    Element as SlateElement
} from 'slate'
import { TextCategory } from '../slate'

export const withLayout = editor => {
    const { normalizeNode } = editor

    editor.normalizeNode = ([node, path]) => {
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

            // for (const [child, childPath] of Node.children(editor, path)) {
            //     let children
            //     const slateIndex = childPath[0]
            //     const enforceText = children => {
            //         console.log('enforceText')
            //         const newProperties: Partial<SlateElement> = { children }
            //         Transforms.setNodes<SlateElement>(editor, newProperties, {
            //             at: childPath
            //         })
            //     }

            //     switch (slateIndex) {
            //     case 0:
            //         children = [{ text: ContentManager.openedDocument.title }]
            //         enforceText(children)
            //         break
            //     default:
            //         break
            //     }
            // }
        }

        return normalizeNode([node, path])
    }

    return editor
}
