import {
    AutomergeChangeEventDTO, CreateDocumentDTO, CreateDocumentResponseDTO, UpdateDocumentChildrenOpenDTO
} from '@newturn-develop/types-molink/dist/DTO'
import { Editor } from 'slate'
import { io, Socket } from 'socket.io-client'
import DocumentHierarchyManager from '../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'

class HierarchyChildrenOpenServer {
    editor: Editor = null
    socket: Socket | undefined

    connect (nickname: string) {
        this.socket = io(`${process.env.HIERARCHY_CHILDREN_OPEN_SERVER_URL}/${nickname}`, {
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
        this.socket.on('change', (dto: AutomergeChangeEventDTO) => this.handleChange(dto))
    }

    private async handleRouterInitialized () {
        this.socket.emit('getDocument')
    }

    private async handleChange (dto: AutomergeChangeEventDTO) {
        console.log(dto)
        const changes = dto.changes.map(change => new Uint8Array(change)) as any
        DocumentHierarchyManager.hierarchy.updateChildrenOpenMap(new AutomergeChangeEventDTO(dto.changeId, changes))
    }

    private handleDisconnect () {
        this.socket.removeListener('msg')
        this.socket.close()
    }

    updateDocumentChildrenOpen (dto: UpdateDocumentChildrenOpenDTO) {
        this.socket.emit('update-document-children-open', dto)
    }
}
export default new HierarchyChildrenOpenServer()
