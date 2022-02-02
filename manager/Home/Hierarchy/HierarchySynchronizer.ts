import { io, Socket } from 'socket.io-client'
import {
    AutomergeChangeEventDTO, AutomergeDocumentDTO, CreateDocumentDTO, HierarchyMergeEventDTO
} from '@newturn-develop/types-molink/dist/DTO'
import HierarchyManager from './HierarchyManager'
import {
    convertAutomergeDocumentForNetwork, getAutomergeDocumentThroughNetwork, convertAutomergeDocumentToDBString,
    convertDBStringToAutomergeDocument
} from '@newturn-develop/molink-automerge-wrapper'

export enum HierarchyChangeType {
    Hierarchy = 'hierarchy-change',
    HierarchyChildrenOpen = 'hierarchy-children-open-change'
}

class HierarchySynchronizer {
    socket: Socket | undefined

    public connect (nickname: string) {
        this.socket = io(`${process.env.HIERARCHY_LIVE_SERVER_URL}/${nickname}`, {
            transports: ['websocket'],
            withCredentials: true
        })

        this.setRouter()

        this.socket.connect()
    }

    public close () {
        this.socket.close()
    }

    public sendChange (changeType: HierarchyChangeType, data: AutomergeChangeEventDTO) {
        if (!this.socket.connected) {
            return
        }
        console.log('hierarchy send change')
        this.socket.emit(changeType, data)
    }

    public sendCreateDocument (id: string) {
        if (!this.socket.connected) {
            return
        }
        return new Promise<void>((resolve, reject) => {
            let isHandled = false
            setTimeout(() => {
                if (!isHandled) {
                    reject(new Error())
                }
            }, 5000)
            this.socket.once('create-document-handled', () => {
                isHandled = true
                resolve()
            })
            this.socket.emit('create-document', new CreateDocumentDTO(id))
        })
    }

    private setRouter () {
        this.socket.on('connect', () => this.handleConnect())
        this.socket.on('hierarchy-change', (data: AutomergeChangeEventDTO) => this.handleHierarchyChange(data))
        this.socket.on('hierarchy-children-open-change', (data: AutomergeChangeEventDTO) => this.handleHierarchyChildrenOpenChange(data))
        this.socket.on('hierarchy-merge', (data: HierarchyMergeEventDTO) => this.handleMerge(data))
        this.socket.on('disconnect', () => this.handleDisconnect())
    }

    private async handleConnect () {
        const savedHierarchy = localStorage.getItem('hierarchyAutomergeValue')
        if (savedHierarchy) {
            const serializedHierarchy = convertDBStringToAutomergeDocument(savedHierarchy)
            this.socket.emit('hierarchy-merge', new AutomergeDocumentDTO(convertAutomergeDocumentForNetwork(serializedHierarchy)))
            localStorage.removeItem('hierarchyAutomergeValue')
        }
    }

    private async handleMerge (dto: HierarchyMergeEventDTO) {
        HierarchyManager.hierarchy.automergeHierarchy = getAutomergeDocumentThroughNetwork(dto.hierarchy)
        HierarchyManager.hierarchy.automergeChildrenOpenMap = getAutomergeDocumentThroughNetwork(dto.hierarchyChildrenOpen)
    }

    private handleHierarchyChange (data: AutomergeChangeEventDTO) {
        const changes = data.changes.map(change => new Uint8Array(change)) as any
        HierarchyManager.hierarchy.update(changes)
    }

    private handleHierarchyChildrenOpenChange (data: AutomergeChangeEventDTO) {
        const changes = data.changes.map(change => new Uint8Array(change)) as any
        HierarchyManager.hierarchy.updateChildrenOpenMap(changes)
    }

    private handleDisconnect () {
        if (!this.socket.connected) {
            localStorage.setItem('hierarchyAutomergeValue', convertAutomergeDocumentToDBString(HierarchyManager.hierarchy.hierarchyValue))
        }
        this.socket.close()
    }
}
export default new HierarchySynchronizer()