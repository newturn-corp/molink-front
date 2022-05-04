import { HierarchyDocumentInfoInterface, PageVisibility } from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import ViewerAPI from '../../../api/ViewerAPI'
import { HierarchyNotExists } from '../../../Errors/HierarchyError'
import { getUUID } from '../../../utils/getUUID'
import ContentAPI from '../../../api/ContentAPI'
import RoutingManager, { Page } from '../../global/RoutingManager'
import UserManager from '../User/UserManager'
import { VisibilityController } from './VisibilityController'
import { LocationController } from './LocationController'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import { PageDragManager } from './PageDragManager'

export default class Hierarchy {
    public visibilityController: VisibilityController
    public locationController: LocationController
    public pageDragManager: PageDragManager

    public userId: number
    public nickname: string
    public websocketProvider: WebsocketProvider = null
    public editable: boolean = false
    public yDocument: Y.Doc
    public yMap: Y.Map<HierarchyDocumentInfoInterface>
    public map: {
        [index: string]: HierarchyDocumentInfoInterface
    } = {}

    public yTopLevelDocumentIdList: Y.Array<string>
    public topLevelDocumentIdList: string[] = []

    public nameChangingPageId: string | null = null
    public selectedPageId: string | null = null
    public openedPageId: string | null = null

    constructor (userId: number, nickname: string) {
        this.userId = userId
        this.nickname = nickname
        this.yDocument = new Y.Doc()
        this.yMap = this.yDocument.getMap('documentHierarchyInfoMap')
        this.yMap.observeDeep(async () => {
            if (this.openedPageId && !this.yMap.get(this.openedPageId)) {
                this.openedPageId = null
                await RoutingManager.moveTo(Page.Blog, `/${this.nickname}`)
            }
            this.map = this.yMap.toJSON()
        })

        this.visibilityController = new VisibilityController(this)
        this.locationController = new LocationController(this)
        this.pageDragManager = new PageDragManager(this)

        this.yTopLevelDocumentIdList = this.yDocument.getArray('topLevelDocumentIdList')
        this.yTopLevelDocumentIdList.observeDeep(() => {
            this.topLevelDocumentIdList = this.yTopLevelDocumentIdList.toArray()
        })
        EventManager.addEventListeners(
            [Event.UnloadPage,
                Event.SignOut
            ], () => {
                this.reset()
            }, 1)
        EventManager.addEventListener(
            Event.PageFileUsageChange,
            (param: any) => {
                if (this.openedPageId) {
                    const openedPage = this.yMap.get(this.openedPageId)
                    openedPage.fileUsage += param.usage
                    this.yMap.set(this.openedPageId, openedPage)
                }
            }, 1
        )
        makeAutoObservable(this, {
            yTopLevelDocumentIdList: false,
            yMap: false
        })
    }

    checkHierarchyEditable () {
        return UserManager.isUserAuthorized && UserManager.userId === this.userId
    }

    public async init () {
        this.editable = this.checkHierarchyEditable()

        if (!this.editable) {
            const dto = await ViewerAPI.getDocumentsHierarchy(this.userId)
            Y.applyUpdate(this.yDocument, Uint8Array.from(dto.hierarchy))
        } else {
            this.websocketProvider = new WebsocketProvider(process.env.HIERARCHY_LIVE_SERVER_URL, this.userId.toString(), this.yDocument, {
                connect: false
            })

            return new Promise<void>((resolve, reject) => {
                let isResolved = false
                // this.websocketProvider.on('sync', (isSynced: boolean) => {
                //     isResolved = true
                //     resolve()
                // })
                const listener = () => {
                    isResolved = true
                    this.yMap.unobserveDeep(listener)
                    resolve()
                }
                this.yMap.observeDeep(listener)
                this.websocketProvider.connect()
                setTimeout(() => {
                    if (!isResolved) {
                        this.yMap.unobserveDeep(listener)
                        reject(new HierarchyNotExists())
                    }
                }, 10000)
            })
        }
    }

    public reset () {
        if (this.websocketProvider) {
            this.websocketProvider.destroy()
        }
        this.selectedPageId = null
        this.openedPageId = null
        this.nameChangingPageId = null
    }

    public async createDocument (order:number, parentId: string | null) {
        const newDocumentId = getUUID()
        const newDocument: HierarchyDocumentInfoInterface = {
            id: newDocumentId,
            title: '새 페이지',
            icon: '📄',
            userId: this.userId,
            visibility: PageVisibility.Private,
            order,
            parentId,
            childrenOpen: false,
            fileUsage: 0,
            children: []
        }
        await ContentAPI.createContent(newDocumentId)

        this.yDocument.transact(() => {
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
        this.selectedPageId = null
        await RoutingManager.moveTo(Page.Blog, `/${this.nickname}/${newDocumentId}/${encodeURIComponent(newDocument.title)}`)
    }

    public updateHierarchyChildrenOpen (pageId: string, isOpen: boolean) {
        const page = this.yMap.get(pageId)
        page.childrenOpen = isOpen
        this.yMap.set(pageId, page)
    }

    public updatePageTitle (pageId: string, title: string) {
        if (!this.editable) {
            return
        }
        const page = this.yMap.get(pageId)
        page.title = title
        this.yMap.set(pageId, page)
        this.selectedPageId = null
        this.nameChangingPageId = null
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

    public openPageParents (pageId: string) {
        const parents = this.getPageHierarchy(pageId)
        this.yDocument.transact(() => {
            for (const parent of parents) {
                if (!parent.childrenOpen) {
                    parent.childrenOpen = true
                    this.yMap.set(parent.id, parent)
                }
            }
        })
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
