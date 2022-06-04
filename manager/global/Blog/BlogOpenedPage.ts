import * as Y from 'yjs'
import { HierarchyDocumentInfoInterface, PageVisibility } from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'

export class BlogOpenedPage {
    private yMap: Y.Map<HierarchyDocumentInfoInterface>

    public readonly pageId: string
    public icon: string
    public title: string
    public visibility: PageVisibility

    constructor (pageId: string, yMap: Y.Map<HierarchyDocumentInfoInterface>) {
        this.pageId = pageId
        this.yMap = yMap

        const page = this.yMap.get(this.pageId)
        this.icon = page.icon
        this.title = page.title
        this.visibility = page.visibility

        this.yMap.observeDeep(() => {
            const page = this.yMap.get(this.pageId)
            this.icon = page.icon
            this.title = page.title
            this.visibility = page.visibility
        })

        makeAutoObservable(this)
    }

    handleEmojiClick (emoji: string) {
        if (this.icon !== emoji) {
            const page = this.yMap.get(this.pageId)
            page.icon = emoji
            this.yMap.set(page.id, page)
        }
    }

    public updateHierarchyChildrenOpen (pageId: string, isOpen: boolean) {
        const page = this.yMap.get(pageId)
        page.childrenOpen = isOpen
        this.yMap.set(pageId, page)
    }
}
