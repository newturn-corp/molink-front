import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import randomColor from 'randomcolor'
import UserManager from '../../global/User/UserManager'
import { withReact } from 'slate-react'
import { createEditor } from 'slate'
import { Awareness } from 'y-protocols/awareness'
import { EditorPlugin } from '../../../plugin'
import { withCursors, withYHistory, withYjs } from '@slate-yjs/core'
import { withHistory } from 'slate-history'
import { Cursor } from 'slate-yjs/dist/main/model'
import { HierarchyNotExists } from '../../../Errors/HierarchyError'
import { makeAutoObservable } from 'mobx'
import { CursorData } from '../../../components/Blog/EditorPage/Editor/Overlay/Cursor/RemoteSelection'

export class EditorSynchronizer {
    websocketProvider: WebsocketProvider = null
    isConnected: boolean = false
    awareness: Awareness
    sharedType: Y.XmlText = null
    cursors: Cursor[] = []

    constructor (pageId: string, yjsDocument: Y.Doc) {
        this.websocketProvider = new WebsocketProvider(process.env.CONTENT_SERVER_URL, pageId, yjsDocument, {
            connect: false
        })
        this.sharedType = this.websocketProvider.doc.get('content', Y.XmlText) as Y.XmlText
        this.websocketProvider.on('status', ({ status }: { status: string }) => {
            this.isConnected = status === 'connected'
        })

        makeAutoObservable(this, {
            sharedType: false,
            websocketProvider: false,
            awareness: false,
            cursors: false
        })
    }

    connect () {
        return new Promise<void>((resolve, reject) => {
            let isResolved = false
            const listener = () => {
                isResolved = true
                console.log(this.sharedType.toDelta())
                this.sharedType.unobserveDeep(listener)
                resolve()
            }
            this.sharedType.observeDeep(listener)
            this.websocketProvider.connect()
            setTimeout(() => {
                if (!isResolved) {
                    this.sharedType.unobserveDeep(listener)
                    reject(new HierarchyNotExists())
                }
            }, 10000)
        })
    }

    getSlateEditor () {
        const cursorData: CursorData = {
            color: randomColor({
                luminosity: 'dark',
                alpha: 1,
                format: 'hex'
            }),
            name: UserManager.profile.nickname
        }

        return EditorPlugin(
            withYHistory(
                withCursors(
                    withYjs(
                        withReact(
                            withHistory(createEditor())
                        ),
                        this.sharedType
                    ),
                    this.websocketProvider.awareness,
                    {
                        data: cursorData
                    }
                )
            )
        )
    }

    reset () {
        if (this.websocketProvider) {
            this.websocketProvider.destroy()
        }
        this.websocketProvider = null
        this.awareness = null
        this.isConnected = false
        this.sharedType = null
        this.cursors = []
    }
}
