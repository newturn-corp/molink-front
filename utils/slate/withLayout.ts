import {
    Transforms,
    Node,
    Element as SlateElement
} from 'slate'
import ContentManager from '../../manager/home/ContentManager'
import { ParagraphElement, TitleElement } from '../slate'

export const withLayout = editor => {
    const { normalizeNode } = editor

    editor.normalizeNode = ([node, path]) => {
        if (path.length === 0) {
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
                case 1:
                    type = type === 'title' ? 'text' : type
                    enforceType(type)
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
