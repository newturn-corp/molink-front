import DialogManager from '../DialogManager'
import { visibilityToText } from '../Hierarchy/HierarchyUtils'
import * as Y from 'yjs'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import { VisibilityController } from './VisibilityController'

export class LocationController {
    public yDocument: Y.Doc
    public yMap: Y.Map<HierarchyDocumentInfoInterface>
    public yTopLevelDocumentIdList: Y.Array<string>
    public visibilityController: VisibilityController

    constructor (yDocument: Y.Doc, yMap: Y.Map<HierarchyDocumentInfoInterface>, yTopLevelDocumentIdList: Y.Array<string>, visibilityController: VisibilityController) {
        this.yDocument = yDocument
        this.yMap = yMap
        this.yTopLevelDocumentIdList = yTopLevelDocumentIdList
        this.visibilityController = visibilityController
    }

    public async updatePageLocation (pageId: string, parentId: string | null, order: number) {
        if (parentId) {
            const parent = this.yMap.get(parentId)
            const page = this.yMap.get(pageId)

            // 만약 부모보다 자식의 공개 범위가 넓으면
            if (this.visibilityController.checkVisibilityWide(page.visibility, parent.visibility) === 1) {
                const action = await DialogManager.openDialog(
                    '페이지 공개 범위 변경',
                    `이 페이지의 공개 범위인 '${visibilityToText(page.visibility)}'가\n새로운 상위 페이지의 공개 범위인 '${visibilityToText(parent.visibility)}'보다 넓습니다.\n이 페이지의 공개 범위가 '${visibilityToText(parent.visibility)}'로 변경됩니다.`, ['변경'])
                if (action === -1) {
                    return
                }
                await this.visibilityController.updatePageVisibility(pageId, parent.visibility)
            }
        }

        this.yDocument.transact(() => {
            const page = this.yMap.get(pageId)
            // 기존 부모에서 제거하고 order 조정
            if (!page.parentId) {
                this.yTopLevelDocumentIdList.delete(page.order, 1)
                for (const [index, documentId] of this.yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(siblingDocument.id, siblingDocument)
                }
            } else {
                const parent = this.yMap.get(page.parentId)
                parent.children.splice(page.order, 1)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(documentId, siblingDocument)
                }
                this.yMap.set(parent.id, parent)
            }
            // 새로운 부모에 추가하고 order 조정
            if (!parentId) {
                if (order > this.yTopLevelDocumentIdList.length) {
                    this.yTopLevelDocumentIdList.push([pageId])
                } else {
                    this.yTopLevelDocumentIdList.insert(order, [pageId])
                }
                for (const [index, documentId] of this.yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(documentId, siblingDocument)
                }
            } else {
                const parent = this.yMap.get(parentId)
                parent.children.splice(order, 0, pageId)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = this.yMap.get(documentId)
                    siblingDocument.order = index
                    this.yMap.set(documentId, siblingDocument)
                }
            }
            page.parentId = parentId
            page.order = order
            this.yMap.set(pageId, page)
        })
    }
}
