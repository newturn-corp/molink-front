import Automerge from 'automerge'
import { makeAutoObservable, makeObservable } from 'mobx'
import { Editor } from 'slate'
import { io, Socket } from 'socket.io-client'
// import Document from '../../../domain/Document'
import { OpenedDocumentInfo } from '../../../domain/OpenedDocumentInfo'
// import { GetDocumentDto, GetDocumentResponseDTO } from '../../../DTO/DocumentDto'
// import ContentManager from '../../ContentManager'

class OnlineManager {
    editor: Editor = null
    socket: Socket | undefined
    openedDocument: any = null

    constructor () {
        makeAutoObservable(this, {
            editor: false,
            socket: false,
            openedDocument: true
        })
    }

    connect (documentId: string) {
        console.log('나 호출')
        this.socket = io(`${process.env.CONTENT_SERVER_URL}/${documentId}`, {
            transports: ['websocket'],
            withCredentials: true
        })

        this.setRouter()

        this.socket.connect()
    }

    private setRouter () {
        this.socket.on('routerInitialized', () => this.handleRouterInitialized())
        this.socket.on('getDocumentResponse', (data) => this.handleGetDocumentResponse(data))
        this.socket.on('disconnect', () => this.handleDisconnect())
    }

    private async handleRouterInitialized () {
        this.socket.emit('getDocument')
    }

    toJS (a:any) {
        return JSON.parse(JSON.stringify(a))
    }

    private async handleGetDocumentResponse (info: OpenedDocumentInfo) {
        console.log(this.openedDocument)
        this.openedDocument = this.toJS(Automerge.from(info))
        // Editor.withoutNormalizing(this.editor, () => {
        //     this.editor.children = this.openedDocument.content
        //     this.editor.onChange()
        // })
        console.log('굿')
    }

    private handleDisconnect () {
        this.socket.removeListener('msg')
        this.socket.close()
    }

    destory () {
        this.socket.removeListener('disconnect')
        this.socket.close()
    }
}
export default new OnlineManager()
