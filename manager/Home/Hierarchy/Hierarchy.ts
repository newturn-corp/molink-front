import {
    HierarchyDocumentInfoInterface
} from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'
import * as Y from 'yjs'
import UserManager from '../../global/UserManager'
import { WebsocketProvider } from 'y-websocket'
import ViewerAPI from '../../../api/ViewerAPI'
import { HierarchyNotExists } from '../../../Errors/HierarchyError'

export default class Hierarchy {
    public nickname: string
    public websocketProvider: WebsocketProvider = null
    public editable: boolean = false
    public yjsDocument: Y.Doc
    public yMap: Y.Map<HierarchyDocumentInfoInterface>
    public map: {
        [index: string]: HierarchyDocumentInfoInterface
    } = {}

    public yTopLevelDocumentIdList: Y.Array<string>
    public topLevelDocumentIdList: string[] = []

    public nameChangingDocumentId: string | null = null
    public selectedDocumentId: string | null = null
    public openedDocumentId: string | null = null

    constructor (nickname: string) {
        this.nickname = nickname
        this.yjsDocument = new Y.Doc()
        this.yMap = this.yjsDocument.getMap('documentHierarchyInfoMap')
        this.yMap.observeDeep(() => {
            this.map = this.yMap.toJSON()
        })
        this.yTopLevelDocumentIdList = this.yjsDocument.getArray('topLevelDocumentIdList')
        this.yTopLevelDocumentIdList.observeDeep(() => {
            this.topLevelDocumentIdList = this.yTopLevelDocumentIdList.toArray()
        })
        makeAutoObservable(this, {
            yTopLevelDocumentIdList: false,
            yMap: false
        })
    }

    async init () {
        this.editable = UserManager.isUserAuthorized && UserManager.profile.nickname === this.nickname
        if (!this.editable) {
            const dto = await ViewerAPI.getDocumentsHierarchy(this.nickname)
            Y.applyUpdate(this.yjsDocument, Uint8Array.from(dto.hierarchy))
        } else {
            this.websocketProvider = new WebsocketProvider(process.env.HIERARCHY_LIVE_SERVER_URL, UserManager.profile.userId.toString(), this.yjsDocument, {
                connect: false
            })
            this.websocketProvider.connect()

            this.websocketProvider.on('status', ({ status }: { status: string }) => {
                console.log('hierarchy')
                console.log(status)
            })
            return new Promise<void>((resolve, reject) => {
                let isResolved = false
                this.websocketProvider.on('sync', (isSynced: boolean) => {
                    console.log('hierarchy')
                    console.log('sync')
                    isResolved = true
                    resolve()
                })
                setTimeout(() => {
                    if (!isResolved) {
                        reject(new HierarchyNotExists())
                    }
                }, 5000)
            })
        }
    }

    public updateHierarchyChildrenOpen (documentId: string, isOpen: boolean) {
        console.log(documentId)
        console.log(isOpen)
        const document = this.yMap.get(documentId)
        document.childrenOpen = isOpen
        this.yMap.set(documentId, document)
    }

    public updateDocumentTitle (documentId: string, title: string) {
        const document = this.yMap.get(documentId)
        document.title = title
        this.yMap.set(documentId, document)
        this.selectedDocumentId = null
        this.nameChangingDocumentId = null
    }

    public updateDocumentLocation (documentId: string, parentId: string | null, order: number) {
        this.yjsDocument.transact(() => {
            const document = this.yMap.get(documentId)
            // 기존 부모에서 제거하고 order 조정
            if (!document.parentId) {
                this.yTopLevelDocumentIdList.delete(document.order, 1)
                for (const [index, documentId] of this.yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(siblingDocument.id, siblingDocument)
                }
            } else {
                const parent = this.yMap.get(document.parentId)
                parent.children.splice(document.order, 1)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(documentId, siblingDocument)
                }
                this.yMap.set(parent.id, parent)
            }
            // 새로운 부모에 추가하고 order 조정
            if (!parentId) {
                this.yTopLevelDocumentIdList.insert(order, [documentId])
                for (const [index, documentId] of this.yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(documentId, siblingDocument)
                }
            } else {
                const parent = this.yMap.get(parentId)
                parent.children.splice(order, 0, documentId)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(documentId, siblingDocument)
                }
            }
            document.parentId = parentId
            document.order = order
            this.yMap.set(documentId, document)
        })
    }

    public getSibling (documentId: string, order: number) {
        const document = this.yMap.get(documentId)
        if (!document.parentId) {
            return this.yMap.get(this.yTopLevelDocumentIdList.get(order))
        } else {
            const parent = this.yMap.get(document.parentId)
            return this.yMap.get(parent.children[order])
        }
    }
}
