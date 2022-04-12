import { Editor, Element, Node, Path, Range } from 'slate'
import { TransformsRemoveNodesHandler } from '../types'
import FileAPI from '../../../api/FileAPI'
import { ChangePageFileRelationshipDTO } from '@newturn-develop/types-molink'
import EditorManager from '../../../manager/Blog/EditorManager'
import UserManager from '../../../manager/global/User/UserManager'
import { isNumber } from 'lodash'

const matchPath = (editor: Editor, path: Path): ((node: Node) => boolean) => {
    const [node] = Editor.node(editor, path)
    return n => n === node
}

export const customRemoveNodes: TransformsRemoveNodesHandler<Node> = (editor, options = {}) => {
    Editor.withoutNormalizing(editor, () => {
        const { hanging = false, voids = false, mode = 'lowest' } = options
        let { at = editor.selection, match } = options

        if (!at) {
            return
        }

        if (match == null) {
            match = Path.isPath(at)
                ? matchPath(editor, at)
                : n => Editor.isBlock(editor, n)
        }

        if (!hanging && Range.isRange(at)) {
            at = Editor.unhangRange(editor, at)
        }

        const depths = Editor.nodes(editor, { at, match, mode, voids })
        const pathRefs = Array.from(depths, ([, p]) => Editor.pathRef(editor, p))

        for (const pathRef of pathRefs) {
            const path = pathRef.unref()!

            if (path) {
                const [node] = Editor.node(editor, path)
                if (Element.isElement(node) && (node.type === 'image' || node.type === 'video' || node.type === 'file')) {
                    if (isNumber(node.size)) {
                        UserManager.limit.totalUploadLimit += node.size
                    }
                    if (node.url && node.url.includes(`${process.env.SERVER_BASE_URL}/files`)) {
                        const handle = node.url.split('/').pop()
                        FileAPI.removePageFileRelationship(new ChangePageFileRelationshipDTO(EditorManager.pageId, handle))
                    }
                }
                editor.apply({ type: 'remove_node', path, node })
            }
        }
    })
    return true
}
