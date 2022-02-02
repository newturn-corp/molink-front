import { makeAutoObservable, observable } from 'mobx'
import { createEditor, Editor } from 'slate'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { SyncElement, toSharedType, withCursor, withYjs } from 'slate-yjs'
import randomColor from 'randomcolor'
import UserManager from './global/UserManager'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { EditorPlugin } from '../plugin/EditorPlugins'
import { TextCategory } from '../Types/slate/CustomElement'

class EditorManager {
    showPlaceholder: boolean = false
    editor: Editor = null
    sharedType: Y.Array<SyncElement> = null
    websocketProvider: WebsocketProvider = null
    isConnected: boolean = false

    constructor () {
        makeAutoObservable(this, {
            editor: observable.ref,
            sharedType: false,
            websocketProvider: false
        })
    }

    init (documentId: string) {
        const doc = new Y.Doc()
        this.sharedType = doc.getArray<SyncElement>('content')
        this.websocketProvider = new WebsocketProvider(process.env.CONTENT_SERVER_URL, documentId, doc, {
            connect: false
        })
        const color = randomColor({
            luminosity: 'dark',
            format: 'rgba',
            alpha: 1
        })

        this.websocketProvider.on('status', ({ status }: { status: string }) => {
            console.log(status)
            this.isConnected = status === 'connected'
        })

        this.websocketProvider.awareness.setLocalState({
            alphaColor: color.slice(0, -2) + '0.2)',
            color,
            name: UserManager.profile.nickname
        })

        // Super hacky way to provide a initial value from the client, if
        // you plan to use y-websocket in prod you probably should provide the
        // initial state from the server.
        this.websocketProvider.on('sync', (isSynced: boolean) => {
            console.log('sync')
            if (isSynced && this.sharedType.length === 0) {
                toSharedType(this.sharedType, [{
                    type: 'title',
                    children: [{ text: '' }]
                }, {
                    type: 'text',
                    category: TextCategory.Content3,
                    children: [{ text: '' }]
                }])
            }
        })

        this.websocketProvider.connect()

        this.editor = EditorPlugin(withCursor(
            withYjs(withReact(withHistory(createEditor())), this.sharedType),
            this.websocketProvider.awareness
        ))
    }
}
export default new EditorManager()
