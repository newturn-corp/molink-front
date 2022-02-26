import {
    DocumentVisibility,
    HierarchyDocumentInfoInterface
} from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'
import * as Y from 'yjs'
import UserManager from '../../global/UserManager'
import { WebsocketProvider } from 'y-websocket'
import ViewerAPI from '../../../api/ViewerAPI'
import { HierarchyNotExists } from '../../../Errors/HierarchyError'
import NewUserManager from '../../global/NewUserManager'
import { getUUID } from '../../../utils/getUUID'
import ContentAPI from '../../../api/ContentAPI'
import RoutingManager, { Page } from '../../global/RoutingManager'

export default class Hierarchy {
    public userId: number
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

    constructor (userId: number, nickname: string) {
        this.userId = userId
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

    checkHierarchyEditable () {
        return NewUserManager.isUserAuthorized && NewUserManager.userId === this.userId
    }

    public async init () {
        this.editable = this.checkHierarchyEditable()
        if (!this.editable) {
            const dto = await ViewerAPI.getDocumentsHierarchy(this.userId)
            Y.applyUpdate(this.yjsDocument, Uint8Array.from(dto.hierarchy))
        } else {
            this.websocketProvider = new WebsocketProvider(process.env.HIERARCHY_LIVE_SERVER_URL, this.userId.toString(), this.yjsDocument, {
                connect: false
            })

            return new Promise<void>((resolve, reject) => {
                let isResolved = false
                this.websocketProvider.on('sync', (isSynced: boolean) => {
                    isResolved = true
                    resolve()
                })
                this.websocketProvider.connect()
                setTimeout(() => {
                    if (!isResolved) {
                        reject(new HierarchyNotExists())
                    }
                }, 10000)
            })
        }
    }

    public async createDocument (order:number, parentId: string | null) {
        const newDocumentId = getUUID()
        const newDocument: HierarchyDocumentInfoInterface = {
            id: newDocumentId,
            title: '새 페이지',
            icon: '📄',
            userId: this.userId,
            visibility: DocumentVisibility.Private,
            order,
            parentId,
            childrenOpen: false,
            children: []
        }
        await ContentAPI.createContent(newDocumentId)

        this.yjsDocument.transact(() => {
            this.yMap.set(newDocument.id, newDocument)
            if (parentId === null) {
                this.yTopLevelDocumentIdList.insert(order, [newDocument.id])

                for (const [index, documentId] of this.yTopLevelDocumentIdList.toArray().entries()) {
                    const document = this.yMap.get(documentId)
                    document.order = index
                    this.yMap.set(documentId, document)
                }
            } else {
                const parent = this.yMap.get(parentId)
                parent.children.splice(order, 0, newDocument.id)
                for (const [index, documentId] of parent.children.entries()) {
                    const document = this.yMap.get(documentId)
                    document.order = index
                    this.yMap.set(documentId, document)
                }
                parent.childrenOpen = true
                this.yMap.set(parentId, parent)
            }
        })
        this.selectedDocumentId = null
        await RoutingManager.moveTo(Page.Blog, `/${this.nickname}/${newDocumentId}/${encodeURIComponent(newDocument.title)}`)
    }

    public updateHierarchyChildrenOpen (documentId: string, isOpen: boolean) {
        if (!this.editable) {
            return
        }
        const document = this.yMap.get(documentId)
        document.childrenOpen = isOpen
        this.yMap.set(documentId, document)
    }

    public updateDocumentTitle (documentId: string, title: string) {
        if (!this.editable) {
            return
        }
        const document = this.yMap.get(documentId)
        document.title = title
        this.yMap.set(documentId, document)
        this.selectedDocumentId = null
        this.nameChangingDocumentId = null
    }

    public updateDocumentLocation (documentId: string, parentId: string | null, order: number) {
        if (!this.editable) {
            return
        }
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

    public getSibling (pageId: string, order: number) {
        const document = this.yMap.get(pageId)
        if (!document.parentId) {
            return this.yMap.get(this.yTopLevelDocumentIdList.get(order))
        } else {
            const parent = this.yMap.get(document.parentId)
            return this.yMap.get(parent.children[order])
        }
    }

    public getPageHierarchy (pageId: string) {
        const page = this.yMap.get(pageId)
        const hierarchy = [page]
        while (true) {
            const lastPage = hierarchy[0]
            if (!lastPage.parentId) {
                break
            }
            const parent = this.yMap.get(lastPage.parentId)
            hierarchy.unshift(parent)
        }
        return hierarchy
    }
}
