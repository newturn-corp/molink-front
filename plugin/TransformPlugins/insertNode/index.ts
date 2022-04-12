import { Editor, Node, Transforms, Element } from 'slate'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import FileAPI from '../../../api/FileAPI'
import { ChangePageFileRelationshipDTO } from '@newturn-develop/types-molink'
import EditorManager from '../../../manager/Blog/EditorManager'
import UserManager from '../../../manager/global/User/UserManager'

const { insertNodes } = Transforms

export const customInsertNode = (editor: Editor, nodes: Node | Node[], options) => {
    const nodeList: Node[] = (typeof nodes[Symbol.iterator] === 'function' ? nodes : [nodes]) as Node[]
    for (const node of nodeList) {
        if (!Element.isElement(node)) {
            break
        }
        if (node.type === 'image' || node.type === 'video' || node.type === 'file') {
            if (node.size > 0) {
                UserManager.limit.totalUploadLimit -= node.size
            }
            if (node.url && node.url.includes(`${process.env.SERVER_BASE_URL}/files`)) {
                const handle = node.url.split('/').pop()
                FileAPI.addPageFileRelationship(new ChangePageFileRelationshipDTO(EditorManager.pageId, handle))
            }
        }
    }
    insertNodes(editor, nodeList, options)
}
