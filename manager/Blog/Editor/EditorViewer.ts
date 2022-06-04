import * as Y from 'yjs'
import { SyncElement, withYjs } from 'slate-yjs'
import ViewerAPI from '../../../api/ViewerAPI'
import { EditorPlugin } from '../../../plugin'
import { withReact } from 'slate-react'
import { createEditor } from 'slate'
import { makeAutoObservable } from 'mobx'
import { withHistory } from 'slate-history'

export class EditorViewer {
    pageId: string = null
    yjsDocument: Y.Doc = null
    sharedType: Y.Array<SyncElement> = null

    constructor (pageId: string, yjsDocument: Y.Doc) {
        this.pageId = pageId
        this.yjsDocument = yjsDocument
        this.sharedType = yjsDocument.getArray<SyncElement>('content')
        makeAutoObservable(this, {
            yjsDocument: false,
            sharedType: false
        })
    }

    async load () {
        const dto = await ViewerAPI.getContent(this.pageId)
        Y.applyUpdate(this.yjsDocument, Uint8Array.from(dto.content))
    }

    getSlateEditor () {
        return EditorPlugin(
            withYjs(withReact(withHistory(createEditor())), this.sharedType))
    }

    reset () {
        this.yjsDocument = null
        this.sharedType = null
    }
}
