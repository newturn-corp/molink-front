import ViewerAPI from '../../../../api/ViewerAPI'
import { EditorPlugin } from '../../../../plugin'
import { withReact } from 'slate-react'
import { createEditor, Editor as SlateEditor, Node } from 'slate'

export class EditorViewer {
    pageId: string = null
    content: Node[]

    constructor (pageId: string) {
        this.pageId = pageId
    }

    async load () {
        const content = await ViewerAPI.getContent(this.pageId)
        this.content = JSON.parse(content.rawContent)
    }

    getSlateEditor (): SlateEditor {
        const editor = EditorPlugin(withReact(createEditor()))
        editor.children = this.content
        return editor
    }

    reset () {
        this.content = null
    }
}
