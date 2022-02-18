import { makeAutoObservable, observable } from 'mobx'
import { createEditor, Editor as SlateEditor } from 'slate'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { SyncElement, withYjs } from 'slate-yjs'
import randomColor from 'randomcolor'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import HierarchyManager from './Hierarchy/HierarchyManager'
import { EditorPlugin } from '../../plugin'
import UserManager from '../global/UserManager'
import ViewerAPI from '../../api/ViewerAPI'
import { DocumentNotExists } from '../../Errors/DocumentError'
import { withCursor } from '../../plugin/EditorPlugins/CursorPlugin'

class EditorManager {
    public editable: boolean = false
    public showPlaceholder: boolean = false
    yjsDocument: Y.Doc = null
    slateEditor: SlateEditor = null
    sharedType: Y.Array<SyncElement> = null
    yInfo: Y.Map<any> = null
    info: any
    websocketProvider: WebsocketProvider = null
    isConnected: boolean = false

    isLocked: boolean = false

    constructor () {
        makeAutoObservable(this, {
            slateEditor: observable.ref,
            yjsDocument: false,
            sharedType: false,
            yInfo: false,
            websocketProvider: false
        })
    }

    async load (documentId: string) {
        this.yjsDocument = new Y.Doc()
        this.sharedType = this.yjsDocument.getArray<SyncElement>('content')
        this.yInfo = this.yjsDocument.getMap('info')
        this.yInfo.observeDeep(() => {
            this.info = this.yInfo.toJSON()
            this.isLocked = this.yInfo.get('isLocked')
            console.log(this.info)
        })
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
        if (!currentHierarchy) {
            throw new DocumentNotExists()
        }
        const document = currentHierarchy.map[documentId]
        if (!document) {
            throw new DocumentNotExists()
        }
        this.editable = UserManager.isUserAuthorized && currentHierarchy.editable && !!document

        if (!this.editable) {
            const dto = await ViewerAPI.getContent(documentId)
            Y.applyUpdate(this.yjsDocument, Uint8Array.from(dto.content))
        } else {
            this.websocketProvider = new WebsocketProvider(process.env.CONTENT_SERVER_URL, documentId, this.yjsDocument, {
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

            this.websocketProvider.connect()
        }
        this.slateEditor = EditorPlugin(withCursor(
            withYjs(withReact(withHistory(createEditor())), this.sharedType),
            this.websocketProvider.awareness
        ))
        currentHierarchy.openedDocumentId = documentId
    }

    disconnect () {
        if (this.websocketProvider) {
            this.websocketProvider.disconnect()
        }
    }

    updateIsLocked (isLocked: boolean) {
        this.yInfo.set('isLocked', isLocked)
    }
}
export default new EditorManager()
