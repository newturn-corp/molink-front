import { CreateDocumentDTO, CreateDocumentResponseDTO, HierarchyChangeEventDTO } from '@newturn-develop/types-molink/dist/DTO'
import Automerge from 'automerge'
import { makeAutoObservable } from 'mobx'
import { Editor } from 'slate'
import { io, Socket } from 'socket.io-client'
import { OpenedDocumentInfo } from '../domain/OpenedDocumentInfo'
import DocumentHierarchyManager from '../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'

class HierarchyLiveServer {
    editor: Editor = null
    socket: Socket | undefined

    connect (nickname: string) {
        console.log(process.env.HIERARCHY_LIVE_SERVER_URL)
        this.socket = io(`${process.env.HIERARCHY_LIVE_SERVER_URL}/${nickname}`, {
            transports: ['websocket'],
            withCredentials: true
        })

        this.setRouter()

        this.socket.connect()
    }

    destory () {
        this.socket.removeListener('disconnect')
        this.socket.close()
    }

    private setRouter () {
        this.socket.on('routerInitialized', () => this.handleRouterInitialized())
        this.socket.on('disconnect', () => this.handleDisconnect())
        this.socket.on('change', (data: HierarchyChangeEventDTO) => this.handleChange(data))
    }

    private async handleRouterInitialized () {
        this.socket.emit('getDocument')
    }

    private async handleChange (data: HierarchyChangeEventDTO) {
        DocumentHierarchyManager.hierarchy.update(data)
        this.socket.emit(`change-${data.id}-handled`)
    }

    createDocument (dto: CreateDocumentDTO) {
        return new Promise<CreateDocumentResponseDTO>((resolve, reject) => {
            this.socket.once('create-document-response', (data: CreateDocumentResponseDTO) => {
                resolve(data)
            })
            this.socket.emit('createDocument', dto)
        })
    }

    private handleDisconnect () {
        this.socket.removeListener('msg')
        this.socket.close()
    }
}
export default new HierarchyLiveServer()
