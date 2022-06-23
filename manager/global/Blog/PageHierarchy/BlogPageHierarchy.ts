import { makeAutoObservable } from 'mobx'
import { VisibilityController } from '../VisibilityController'
import { LocationController } from '../LocationController'
import { PageDragManager } from '../PageDragManager'
import * as Y from 'yjs'
import { CreatePageDTO, CreatePageInBlogDTO, HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import RoutingManager, { Page } from '../../RoutingManager'
import { BlogSynchronizer } from './BlogSynchronizer'
import { BlogContextMenu } from './BlogContextMenu'
import { BlogOpenedPage } from './BlogOpenedPage'
import EventManager from '../../Event/EventManager'
import { Event } from '../../Event/Event'
import ContentAPI from '../../../../api/ContentAPI'
import HierarchyAPI from '../../../../api/HierarchyAPI'
import Blog from '../Blog'

export enum BlogPageType {
    UserMainPage,
    NormalPage
}

export class BlogPageHierarchy {
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

    constructor (yDocument: Y.Doc) {
        this.yDocument = yDocument
        this.yMap = yDocument.getMap('pageInfoMap')
        this.yMap.observeDeep(async () => {
            if (this.openedPage && !this.yMap.get(this.openedPage.pageId)) {
                this.closeOpenedPage()
                // TODO: 여기 수정
                await RoutingManager.moveTo(Page.Blog, `/${Blog.profile.name}`)
            }
            this.map = this.yMap.toJSON()
        })
        this.yTopLevelDocumentIdList = yDocument.getArray('topLevelPageIDList')
        this.yTopLevelDocumentIdList.observeDeep(() => {
            this.topLevelDocumentIdList = this.yTopLevelDocumentIdList.toArray()
        })

        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.closeOpenedPage()
        }, 1)
        makeAutoObservable(this, {
            yMap: false,
            yTopLevelDocumentIdList: false
        })
    }

    async loadEditingComponent () {
        this.visibilityController = new VisibilityController()
        this.locationController = new LocationController(this.yDocument, this.yMap, this.yTopLevelDocumentIdList, this.visibilityController)
        this.pageDragManager = new PageDragManager(this)
        this.contextMenu = new BlogContextMenu()
    }

    openPage (pageId) {
        if (this.openedPage) {
            this.openedPage.reset()
        }
        this.openedPage = new BlogOpenedPage(pageId, this.yMap)
    }

    closeOpenedPage () {
        if (!this.openedPage) {
            return
        }
        this.openedPage.reset()
        this.openedPage = null
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
        this.closeOpenedPage()
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
        const { id: newPageId } = await ContentAPI.createContentV2(new CreatePageDTO(null, null, null, null, Blog.id))
        await HierarchyAPI.createPageInBlog(new CreatePageInBlogDTO(newPageId, Blog.id, undefined, undefined, order, parentId))
        this.contextMenu.selectedPageId = null
        await RoutingManager.moveWithoutAddHistory(Page.Blog, `/blog-name/${newPageId}/page-name`)
    }

    public getPageHierarchy (pageId: string) {
        const page = this.map[pageId]
        const hierarchy = [page]
        while (true) {
            const lastPage = hierarchy[0]
            if (!lastPage.parentId) {
                break
            }
            const parent = this.map[lastPage.parentId]
            hierarchy.unshift(parent)
        }
        return hierarchy
    }

    getPage (pageId) {
        return this.yMap.get(pageId)
    }
}
