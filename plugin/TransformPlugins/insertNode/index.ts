import { Editor, Node, Transforms, Element } from 'slate'
import FileAPI from '../../../api/FileAPI'
import { ChangePageFileRelationshipDTO } from '@newturn-develop/types-molink'
import EventManager from '../../../manager/global/Event/EventManager'
import { Event } from '../../../manager/global/Event/Event'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
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
                UserManager.limit.handleInsertFile(node.size)
            }
            if (node.url && node.url.includes(`${process.env.SERVER_BASE_URL}/files`)) {
                const handle = node.url.split('/').pop()
                FileAPI.addPageFileRelationship(new ChangePageFileRelationshipDTO(EditorPage.pageId, handle))
            }
        }
    }
    insertNodes(editor, nodeList, options)
}
