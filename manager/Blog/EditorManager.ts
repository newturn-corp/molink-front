import { makeAutoObservable, observable } from 'mobx'
import { createEditor, Editor as SlateEditor } from 'slate'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { SyncElement, withYjs } from 'slate-yjs'
import randomColor from 'randomcolor'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { EditorPlugin } from '../../plugin'
import ViewerAPI from '../../api/ViewerAPI'
import { DocumentNotExists } from '../../Errors/DocumentError'
import { withCursor } from '../../plugin/EditorPlugins/CursorPlugin'
import { Awareness } from 'y-protocols/awareness'
import { Cursor } from 'slate-yjs/dist/main/model'
import { relativePositionToAbsolutePosition } from '../../utils/relativePositionToAbsolutePosition'
import { Event } from '../global/Event/Event'
import UserManager from '../global/User/UserManager'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import EventManager from '../global/Event/EventManager'

class EditorManager {
    public editable: boolean = false
    public showPlaceholder: boolean = false
    yjsDocument: Y.Doc = null
    slateEditor: SlateEditor = null
    sharedType: Y.Array<SyncElement> = null
    yInfo: Y.Map<any> = null
    info: any
    websocketProvider: WebsocketProvider = null
    awareness: Awareness
    isConnected: boolean = false
    cursors: Cursor[] = []

    isLocked: boolean = false
    isToolbarOpen: boolean = true

    constructor () {
        makeAutoObservable(this, {
            slateEditor: observable.ref,
            yjsDocument: false,
            sharedType: false,
            yInfo: false,
            websocketProvider: false
        })
        EventManager.addEventListeners(
            [Event.UnloadPage,
                Event.MoveToAnotherPage
            ], () => {
                this.reset()
            }, 1)
    }

    async load (documentId: string) {
        this.yjsDocument = new Y.Doc()
        this.sharedType = this.yjsDocument.getArray<SyncElement>('content')
        this.sharedType.observeDeep(() => {
            console.log(this.sharedType.toJSON())
        })
        this.yInfo = this.yjsDocument.getMap('info')
        this.yInfo.observeDeep(() => {
            this.info = this.yInfo.toJSON()
            this.isLocked = this.yInfo.get('isLocked')
        })
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
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
            this.slateEditor = EditorPlugin(
                withYjs(withReact(withHistory(createEditor())), this.sharedType))
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
                this.isConnected = status === 'connected'
            })

            this.awareness = this.websocketProvider.awareness

            this.awareness.setLocalState({
                alphaColor: color.slice(0, -2) + '0.2)',
                color,
                name: UserManager.profile.nickname
            })

            this.awareness.on('update', () => {
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
            })

            this.websocketProvider.connect()
            this.slateEditor = EditorPlugin(withCursor(
                withYjs(withReact(withHistory(createEditor())), this.sharedType),
                this.websocketProvider.awareness
            ))
        }
        currentHierarchy.openedDocumentId = documentId
    }

    reset () {
        if (this.websocketProvider) {
            this.websocketProvider.destroy()
        }
        this.editable = false
        this.showPlaceholder = false
        this.yjsDocument = null
        this.slateEditor = null
        this.sharedType = null
        this.yInfo = null
        this.info = null
        this.websocketProvider = null
        this.isConnected = false
        this.isLocked = false
    }

    updateIsLocked (isLocked: boolean) {
        this.yInfo.set('isLocked', isLocked)
    }

    async updateIsToolbarOpen (isOpen: boolean) {
        this.isToolbarOpen = isOpen
        await EventManager.issueEvent(Event.ToolbarOnOffChange, { isToolbarOpen: isOpen })
    }
}
export default new EditorManager()
