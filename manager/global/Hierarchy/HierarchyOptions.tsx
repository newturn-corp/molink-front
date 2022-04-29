import HierarchyManager from './HierarchyManager'
import DialogManager from '../../global/DialogManager'
import RoutingManager, { Page } from '../../global/RoutingManager'
import Hierarchy from './Hierarchy'
import { getChildren } from './HierarchyUtils'
import ContentAPI from '../../../api/ContentAPI'
import { DeleteContentsDTO } from '@newturn-develop/types-molink'
import UserManager from '../User/UserManager'
import React, { ReactNode } from 'react'
import NewPageIcon from 'public/image/icon/new-page.svg'
import EditIcon from 'public/image/icon/edit.svg'
import TrashCanIcon from 'public/image/icon/trash-can.svg'
import LanguageManager from '../LanguageManager'

export abstract class HierarchyControlOption {
    name: string = ''
    documentId: string | null
    icon: ReactNode

    constructor (documentId: string | null) {
        this.documentId = documentId
    }

    abstract handleOnClick ()
}

export class CreateNewPageOption extends HierarchyControlOption {
    constructor (documentId: string | null) {
        super(documentId)
        this.name = documentId ? LanguageManager.languageMap.CreateChildPage : LanguageManager.languageMap.CreatePage
        this.icon = <NewPageIcon/>
    }

    getOrder (hierarchy: Hierarchy) {
        if (this.documentId) {
            const block = hierarchy.yMap.get(this.documentId)
            return block.children.length
        } else {
            return hierarchy.yTopLevelDocumentIdList.length
        }
    }

    async handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        const order = this.getOrder(currentHierarchy)
        const parentId = this.documentId
        await currentHierarchy.createDocument(order, parentId)
    }
}

export class ChangePageNameOption extends HierarchyControlOption {
    constructor (documentId: string | null) {
        super(documentId)
        this.name = LanguageManager.languageMap.ChangePageName
        this.icon = <EditIcon/>
    }

    handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        currentHierarchy.nameChangingPageId = this.documentId
    }
}

export class DeletePageOption extends HierarchyControlOption {
    constructor (documentId: string | null) {
        super(documentId)
        this.name = LanguageManager.languageMap.Delete
        this.icon = <TrashCanIcon/>
    }

    getChildrenCount (hierarchy: Hierarchy, documentId: string) {
        const document = HierarchyManager.hierarchy.yMap.get(documentId)
        return document.children.length + document.children.reduce((prev, current) => {
            return prev + this.getChildrenCount(hierarchy, current)
        }, 0)
    }

    async handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        const page = currentHierarchy.yMap.get(this.documentId)
        const childIDList = getChildren(currentHierarchy.map, page.id)
        const msg = childIDList.length > 0
            ? `${page.title}${LanguageManager.languageMap.DeletePageDialogMsg1}${childIDList.length}${LanguageManager.languageMap.DeletePageDialogMsg2}`
            : `${page.title}${LanguageManager.languageMap.DeletePageDialogMsgOnlyOnePage}`
        const index = await DialogManager.openDialog(LanguageManager.languageMap.DeletePage, msg, [LanguageManager.languageMap.Accept])
        if (index !== 0) {
            return
        }
        const isOpenedDocumentIncludes = currentHierarchy.openedPageId === page.id || childIDList.includes(currentHierarchy.openedPageId)
        if (isOpenedDocumentIncludes) {
            currentHierarchy.openedPageId = null
        }

        currentHierarchy.yDocument.transact(() => {
            const targetDocument = currentHierarchy.yMap.get(this.documentId)

            if (targetDocument.parentId === null) {
                currentHierarchy.yTopLevelDocumentIdList.delete(targetDocument.order, 1)
                for (const [index, documentId] of currentHierarchy.yTopLevelDocumentIdList.toArray().entries()) {
                    const document = currentHierarchy.yMap.get(documentId)
                    document.order = index
                    currentHierarchy.yMap.set(documentId, document)
                }
            } else {
                const parent = currentHierarchy.yMap.get(targetDocument.parentId)
                parent.children.splice(targetDocument.order, 1)
                for (const [index, childId] of parent.children.entries()) {
                    const document = currentHierarchy.yMap.get(childId)
                    document.order = index
                    currentHierarchy.yMap.set(childId, document)
                }
                currentHierarchy.yMap.set(targetDocument.parentId, parent)
            }
            for (const childID of childIDList) {
                currentHierarchy.yMap.delete(childID)
            }
            currentHierarchy.yMap.delete(page.id)
        })
        const deleteList = [...childIDList, page.id]
        await ContentAPI.deleteContents(new DeleteContentsDTO(deleteList))
        currentHierarchy.selectedPageId = null
        if (isOpenedDocumentIncludes) {
            UserManager.profile.setLastOpenPageId(null)
            await RoutingManager.moveTo(Page.Blog, `/${currentHierarchy.nickname}`)
        }
    }
}

export class SettingDocumentListOption extends HierarchyControlOption {
    constructor (documentId: string | null) {
        super(documentId)
        this.name = LanguageManager.languageMap.SettingHierarchy
        this.icon = <TrashCanIcon/>
    }

    async handleOnClick () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        currentHierarchy.selectedPageId = null
        await RoutingManager.moveTo(Page.SettingDocumentList)
    }
}
