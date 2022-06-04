import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import randomColor from 'randomcolor'
import UserManager from '../../global/User/UserManager'
import { ReactEditor, withReact } from 'slate-react'
import { createEditor, Transforms } from 'slate'
import { Awareness } from 'y-protocols/awareness'
import { throttle } from 'lodash'
import { relativePositionToAbsolutePosition } from '../../../utils/relativePositionToAbsolutePosition'
import { EditorPlugin } from '../../../plugin'
import { SyncElement, withCursor, withYjs } from 'slate-yjs'
import { withHistory } from 'slate-history'
import { Cursor } from 'slate-yjs/dist/main/model'
import { HierarchyNotExists } from '../../../Errors/HierarchyError'
import EditorPage from './EditorPage'
import { makeAutoObservable } from 'mobx'

export class EditorSynchronizer {
    websocketProvider: WebsocketProvider = null
    isConnected: boolean = false
    awareness: Awareness
    sharedType: Y.Array<SyncElement> = null
    cursors: Cursor[] = []

    constructor (pageId: string, yjsDocument: Y.Doc) {
        this.sharedType = yjsDocument.getArray<SyncElement>('content')

        this.websocketProvider = new WebsocketProvider(process.env.CONTENT_SERVER_URL, pageId, yjsDocument, {
            connect: false
        })
        const color = randomColor({
            luminosity: 'dark',
            format: 'rgba',
            alpha: 1
        })

        this.websocketProvider.on('status', ({ status }: { status: string }) => {
            this.isConnected = status === 'connected'
        })

        this.awareness = this.websocketProvider.awareness

        this.awareness.setLocalState({
            alphaColor: color.slice(0, -2) + '0.2)',
            color,
            name: UserManager.profile.nickname
        })

        this.awareness.on('update', throttle(() => {
            if (!this.sharedType) {
                return
            }
            const newCursorData = Array.from(this.awareness.getStates())
                .filter(([clientId]) => clientId !== this.sharedType.doc?.clientID)
                .map(([, awareness]) => {
                    let anchor = null
                    let focus = null

                    if (awareness.anchor) {
                        anchor = relativePositionToAbsolutePosition(
                            this.sharedType,
                            awareness.anchor
                        )
                    }

                    if (awareness.focus) {
                        focus = relativePositionToAbsolutePosition(
                            this.sharedType,
                            awareness.focus
                        )
                    }

                    return {
                        anchor,
                        focus,
                        data: awareness
                    }
                })
                .filter((cursor) => cursor.anchor && cursor.focus)
            this.cursors = newCursorData
        }, 300))
        makeAutoObservable(this, {
            sharedType: false,
            websocketProvider: false,
            awareness: false
        })
    }

    connect () {
        return new Promise<void>((resolve, reject) => {
            let isResolved = false
            const listener = () => {
                isResolved = true
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
        return EditorPlugin(
            withCursor(
                withYjs(
                    withReact(
                        withHistory(createEditor())
                    ),
                    this.sharedType
                ),
                this.awareness
            ))
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
