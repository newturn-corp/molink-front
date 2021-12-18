import {
    Transforms,
    Node,
    Element as SlateElement
} from 'slate'
import { ParagraphElement, TitleElement } from '../slate'

export const withLayout = editor => {
    const { normalizeNode } = editor

    editor.normalizeNode = ([node, path]) => {
        if (path.length === 0) {
            if (editor.children.length < 1) {
                const title: TitleElement = {
                    type: 'title',
                    children: [{ text: 'Untitled' }]
                }
                Transforms.insertNodes(editor, title, { at: path.concat(0) })
            }

            // if (editor.children.length < 2) {
            //     const paragraph: ParagraphElement = {
            //         type: 'paragraph',
            //         children: [{ text: '' }]
            //     }
            //     Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
            // }

            for (const [child, childPath] of Node.children(editor, path)) {
                let type: string
                const slateIndex = childPath[0]
                const enforceType = type => {
                    if (SlateElement.isElement(child) && child.type !== type) {
                        const newProperties: Partial<SlateElement> = { type }
                        Transforms.setNodes<SlateElement>(editor, newProperties, {
                            at: childPath
                        })
                    }
                }

                switch (slateIndex) {
                case 0:
                    type = 'title'
                    enforceType(type)
                    break
                default:
                    break
                }
            }
        }

        return normalizeNode([node, path])
    }

    return editor
}
