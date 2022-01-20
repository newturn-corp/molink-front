import { Editor } from 'slate'

import { withIOCollaboration } from '@slate-collaborative/client'
import UserManager from '../manager/global/UserManager'
import ContentManager from '../manager/ContentManager'

export const OnlinePlugin = (editor: Editor) => {
    if (!ContentManager.openedDocument) {
        return editor
    }
    const documentId = ContentManager.openedDocument.meta.id
    const options = {
        docId: documentId,
        url: `${process.env.CONTENT_SERVER_URL}/${documentId}`,
        connectOpts: {
            query: {
                token: UserManager.userId,
                slug: documentId
            },
            withCredentials: true,
            transports: ['websocket']
        }
    }

    const newEditor = withIOCollaboration(editor as any, options)
    return newEditor
}
