import { io, Socket } from 'socket.io-client'
import {
    AutomergeChangeEventDTO, HierarchyMergeEventDTO
} from '@newturn-develop/types-molink/dist/DTO'
import ContentManager from './ContentManager'

class ContentSynchronizer {
    socket: Socket | undefined

    public connect (documentId: string) {
        this.socket = io(`${process.env.CONTENT_SERVER_URL}/${documentId}`, {
            transports: ['websocket'],
            withCredentials: true
        })

        this.setRouter()

        this.socket.connect()
    }

    public close () {
        this.socket.close()
    }

    public sendChange (data: AutomergeChangeEventDTO) {
        if (!this.socket.connected) {
            return
        }
        console.log('content send change')
        this.socket.emit('change', data)
    }

    private setRouter () {
        this.socket.on('connect', () => this.handleConnect())
        this.socket.on('change', (data: AutomergeChangeEventDTO) => this.handleChange(data))
        this.socket.on('merge', (data: HierarchyMergeEventDTO) => this.handleMerge(data))
        this.socket.on('disconnect', () => this.handleDisconnect())
    }

    private async handleConnect () {
        console.log('content synchronizer connected')
        // const savedHierarchy = localStorage.getItem('hierarchyAutomergeValue')
        // console.log(`savedHierarchy ${savedHierarchy}`)
        // if (savedHierarchy) {
        //     const serializedHierarchy = convertDBStringToAutomergeDocument(savedHierarchy)
        //     this.socket.emit('hierarchy-merge', new AutomergeDocumentDTO(convertAutomergeDocumentForNetwork(serializedHierarchy)))
        //     localStorage.removeItem('hierarchyAutomergeValue')
        // }
    }

    private async handleMerge (dto: HierarchyMergeEventDTO) {
        // console.log('hierarchy merge')
        // Hierarchy.hierarchy.automergeHierarchy = getAutomergeDocumentThroughNetwork(dto.hierarchy)
        // Hierarchy.hierarchy.automergeChildrenOpenMap = getAutomergeDocumentThroughNetwork(dto.hierarchyChildrenOpen)
    }

    private handleChange (data: AutomergeChangeEventDTO) {
        console.log('handle content change')
        const changes = data.changes.map(change => new Uint8Array(change)) as any
        ContentManager.handleChangeFromOtherClient(changes)
    }

    private handleDisconnect () {
        console.log('synchronizer disconnected')
        // if (!this.socket.connected) {
        //     localStorage.setItem('hierarchyAutomergeValue', convertAutomergeDocumentToDBString(Hierarchy.hierarchy.hierarchyValue))
        // }
        this.socket.close()
    }
}
export default new ContentSynchronizer()
