import { makeAutoObservable } from 'mobx'
import { VisibilityController } from './VisibilityController'
import { LocationController } from './LocationController'
import { PageDragManager } from './PageDragManager'
import * as Y from 'yjs'
import { CreatePageDTO, CreatePageInBlogDTO, HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import RoutingManager, { Page } from '../RoutingManager'
import { BlogSynchronizer } from './BlogSynchronizer'
import UserManager from '../User/UserManager'
import ViewerAPI from '../../../api/ViewerAPI'
import { BlogContextMenu } from './BlogContextMenu'
import { BlogOpenedPage } from './BlogOpenedPage'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import ContentAPI from '../../../api/ContentAPI'
import HierarchyAPI from '../../../api/HierarchyAPI'
import Blog from './Blog'

export enum BlogPageType {
    UserMainPage,
    NormalPage
}

export class BlogPageHierarchy {
    id: number
    pageType: BlogPageType = BlogPageType.NormalPage

    public synchronizer: BlogSynchronizer

    public yDocument: Y.Doc
    public yMap: Y.Map<HierarchyDocumentInfoInterface>
    public map: {
        [index: string]: HierarchyDocumentInfoInterface
    } = {}

    public yTopLevelDocumentIdList: Y.Array<string>
    public topLevelDocumentIdList: string[] = []

    public nameChangingPageId: string | null = null
    public editable: boolean = false
    public isHierarchyOptionOpen: boolean = false

    public visibilityController: VisibilityController
    public locationController: LocationController
    public pageDragManager: PageDragManager
    public contextMenu: BlogContextMenu = null
    public openedPage: BlogOpenedPage = null

    constructor () {
        this.yDocument = new Y.Doc()
        this.yMap = this.yDocument.getMap('documentHierarchyInfoMap')
        this.yMap.observeDeep(async () => {
            if (this.openedPage && !this.yMap.get(this.openedPage.pageId)) {
                this.openedPage = null
                await RoutingManager.moveTo(Page.Blog, `/${Blog.blogUserInfo.nickname}`)
            }
            this.map = this.yMap.toJSON()
        })
        this.yTopLevelDocumentIdList = this.yDocument.getArray('topLevelDocumentIdList')
        this.yTopLevelDocumentIdList.observeDeep(() => {
            this.topLevelDocumentIdList = this.yTopLevelDocumentIdList.toArray()
        })

        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.openedPage = null
        }, 1)
        makeAutoObservable(this, {
            yMap: false,
            yTopLevelDocumentIdList: false
        })
    }

    async load (userId: number) {
        this.id = userId
        this.editable = UserManager.isUserAuthorized && UserManager.userId === this.id
        if (this.editable) {
            this.visibilityController = new VisibilityController()
            this.locationController = new LocationController(this.yDocument, this.yMap, this.yTopLevelDocumentIdList, this.visibilityController)
            this.pageDragManager = new PageDragManager(this)
            this.synchronizer = new BlogSynchronizer(this.id, this.yDocument)
            this.contextMenu = new BlogContextMenu()
            await this.synchronizer.connect(this.yMap)
        } else {
            const dto = await ViewerAPI.getDocumentsHierarchy(this.id)
            Y.applyUpdate(this.yDocument, Uint8Array.from(dto.hierarchy))
        }
    }

    openPage (pageId) {
        this.openedPage = new BlogOpenedPage(pageId, this.yMap)
    }

    public reset () {
        if (this.synchronizer) {
            this.synchronizer.reset()
        }
        if (this.pageDragManager) {
            this.pageDragManager.clear()
        }

        this.map = {}
        this.topLevelDocumentIdList = []
        this.openedPage = null
        this.nameChangingPageId = null
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
        this.contextMenu.selectedPageId = null
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
        const pageHierarchy = this.getPageHierarchy(pageId)
        pageHierarchy.pop()
        this.yDocument.transact(() => {
            for (const parent of pageHierarchy) {
                if (!parent.childrenOpen) {
                    parent.childrenOpen = true
                    this.yMap.set(parent.id, parent)
                }
            }
        })
    }

    public async createPage (order:number, parentId: string | null) {
        const { id: newPageId } = await ContentAPI.createContentV2(new CreatePageDTO(null, null, null, null))
        await HierarchyAPI.createPageInBlog(new CreatePageInBlogDTO(newPageId, order, parentId))
        this.contextMenu.selectedPageId = null
        await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${newPageId}`)
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

    getPage (pageId) {
        return this.yMap.get(pageId)
    }
}
