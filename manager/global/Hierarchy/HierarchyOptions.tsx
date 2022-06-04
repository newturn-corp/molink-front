import DialogManager from '../../global/DialogManager'
import RoutingManager, { Page } from '../../global/RoutingManager'
import { getChildren } from './HierarchyUtils'
import ContentAPI from '../../../api/ContentAPI'
import { DeleteContentsDTO } from '@newturn-develop/types-molink'
import UserManager from '../User/UserManager'
import React, { ReactNode } from 'react'
import NewPageIcon from 'public/image/icon/new-page.svg'
import EditIcon from 'public/image/icon/edit.svg'
import TrashCanIcon from 'public/image/icon/trash-can.svg'
import LanguageManager from '../LanguageManager'
import Blog from '../Blog/Blog'
import { BlogPageHierarchy } from '../Blog/BlogPageHierarchy'

export abstract class HierarchyControlOption {
    name: string = ''
    pageID: string | null
    icon: ReactNode

    protected constructor (pageID: string | null) {
        this.pageID = pageID
    }

    abstract handleOnClick ()
}

export class CreateNewPageOption extends HierarchyControlOption {
    constructor (pageID: string | null) {
        super(pageID)
        this.name = pageID ? LanguageManager.languageMap.CreateChildPage : LanguageManager.languageMap.CreatePage
        this.icon = <NewPageIcon/>
    }

    getOrder (hierarchy: BlogPageHierarchy) {
        if (this.pageID) {
            const block = hierarchy.yMap.get(this.pageID)
            return block.children.length
        } else {
            return hierarchy.yTopLevelDocumentIdList.length
        }
    }

    async handleOnClick () {
        const order = this.getOrder(Blog.pageHierarchy)
        const parentId = this.pageID
        await Blog.pageHierarchy.createPage(order, parentId)
    }
}

export class ChangePageNameOption extends HierarchyControlOption {
    constructor (pageID: string | null) {
        super(pageID)
        this.name = LanguageManager.languageMap.ChangePageName
        this.icon = <EditIcon/>
    }

    handleOnClick () {
        Blog.pageHierarchy.nameChangingPageId = this.pageID
    }
}

export class DeletePageOption extends HierarchyControlOption {
    constructor (pageID: string | null) {
        super(pageID)
        this.name = LanguageManager.languageMap.Delete
        this.icon = <TrashCanIcon/>
    }

    getChildrenCount (hierarchy: BlogPageHierarchy, pageID: string) {
        const page = hierarchy.yMap.get(pageID)
        return page.children.length + page.children.reduce((prev, current) => {
            return prev + this.getChildrenCount(hierarchy, current)
        }, 0)
    }

    async handleOnClick () {
        const pageHierarchy = Blog.pageHierarchy
        const page = pageHierarchy.yMap.get(this.pageID)
        const childIDList = getChildren(pageHierarchy.map, page.id)
        const msg = childIDList.length > 0
            ? `${page.title}${LanguageManager.languageMap.DeletePageDialogMsg1}${childIDList.length}${LanguageManager.languageMap.DeletePageDialogMsg2}`
            : `${page.title}${LanguageManager.languageMap.DeletePageDialogMsgOnlyOnePage}`
        const index = await DialogManager.openDialog(LanguageManager.languageMap.DeletePage, msg, [LanguageManager.languageMap.Accept])
        if (index !== 0) {
            pageHierarchy.contextMenu.selectedPageId = null
            return
        }

        // 파일 사용량 복구
        for (const childID of childIDList) {
            const childPage = pageHierarchy.yMap.get(childID)
            UserManager.limit.totalUploadLimit += childPage.fileUsage
        }
        UserManager.limit.totalUploadLimit += page.fileUsage

        const isOpenedDocumentIncludes = pageHierarchy.openedPage.pageId === page.id || childIDList.includes(pageHierarchy.openedPage.pageId)
        if (isOpenedDocumentIncludes) {
            pageHierarchy.openedPage = null
        }

        // 페이지 먼저 삭제
        const deleteList = [...childIDList, page.id]
        await ContentAPI.deleteContents(new DeleteContentsDTO(deleteList))

        pageHierarchy.yDocument.transact(() => {
            const targetDocument = pageHierarchy.yMap.get(this.pageID)

            if (targetDocument.parentId === null) {
                pageHierarchy.yTopLevelDocumentIdList.delete(targetDocument.order, 1)
                for (const [index, documentId] of pageHierarchy.yTopLevelDocumentIdList.toArray().entries()) {
                    const document = pageHierarchy.yMap.get(documentId)
                    document.order = index
                    pageHierarchy.yMap.set(documentId, document)
                }
            } else {
                const parent = pageHierarchy.yMap.get(targetDocument.parentId)
                parent.children.splice(targetDocument.order, 1)
                for (const [index, childId] of parent.children.entries()) {
                    const document = pageHierarchy.yMap.get(childId)
                    document.order = index
                    pageHierarchy.yMap.set(childId, document)
                }
                pageHierarchy.yMap.set(targetDocument.parentId, parent)
            }
            for (const childID of childIDList) {
                pageHierarchy.yMap.delete(childID)
            }
            pageHierarchy.yMap.delete(page.id)
        })

        pageHierarchy.contextMenu.selectedPageId = null
        if (isOpenedDocumentIncludes) {
            await RoutingManager.moveTo(Page.Blog, `/${Blog.blogUserInfo.nickname}`)
        }
    }
}

export class SettingDocumentListOption extends HierarchyControlOption {
    constructor (pageID: string | null) {
        super(pageID)
        this.name = LanguageManager.languageMap.SettingHierarchy
        this.icon = <TrashCanIcon/>
    }

    async handleOnClick () {
        Blog.pageHierarchy.contextMenu.selectedPageId = null
        await RoutingManager.moveTo(Page.SettingDocumentList)
    }
}
