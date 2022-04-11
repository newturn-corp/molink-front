import Hierarchy from './Hierarchy'
import DialogManager from '../DialogManager'
import { visibilityToText } from './HierarchyUtils'

export class LocationController {
    private readonly hierarchy: Hierarchy

    constructor (hierarchy) {
        this.hierarchy = hierarchy
    }

    public async updatePageLocation (pageId: string, parentId: string | null, order: number) {
        const {
            yDocument,
            yMap,
            yTopLevelDocumentIdList,
            editable,
            visibilityController
        } = this.hierarchy

        if (!editable) {
            return
        }

        if (parentId) {
            const parent = yMap.get(parentId)
            const page = yMap.get(pageId)

            // 만약 부모보다 자식의 공개 범위가 넓으면
            if (visibilityController.checkVisibilityWide(page.visibility, parent.visibility) === 1) {
                const action = await DialogManager.openDialog(
                    '페이지 공개 범위 변경',
                    `이 페이지의 공개 범위인 '${visibilityToText(page.visibility)}'가\n새로운 상위 페이지의 공개 범위인 '${visibilityToText(parent.visibility)}'보다 넓습니다.\n이 페이지의 공개 범위가 '${visibilityToText(parent.visibility)}'로 변경됩니다.`, ['변경'])
                if (action === -1) {
                    return
                }
                await visibilityController.updatePageVisibility(pageId, parent.visibility)
            }
        }

        yDocument.transact(() => {
            const page = yMap.get(pageId)
            // 기존 부모에서 제거하고 order 조정
            if (!page.parentId) {
                yTopLevelDocumentIdList.delete(page.order, 1)
                for (const [index, documentId] of yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = yMap.get(documentId)
                    siblingDocument.order = index
                    yMap.set(siblingDocument.id, siblingDocument)
                }
            } else {
                const parent = yMap.get(page.parentId)
                parent.children.splice(page.order, 1)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = yMap.get(documentId)
                    siblingDocument.order = index
                    yMap.set(documentId, siblingDocument)
                }
                yMap.set(parent.id, parent)
            }
            // 새로운 부모에 추가하고 order 조정
            if (!parentId) {
                if (order > yTopLevelDocumentIdList.length) {
                    yTopLevelDocumentIdList.push([pageId])
                } else {
                    yTopLevelDocumentIdList.insert(order, [pageId])
                }
                for (const [index, documentId] of yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = yMap.get(documentId)
                    siblingDocument.order = index
                    yMap.set(documentId, siblingDocument)
                }
            } else {
                const parent = yMap.get(parentId)
                parent.children.splice(order, 0, pageId)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = yMap.get(documentId)
                    siblingDocument.order = index
                    yMap.set(documentId, siblingDocument)
                }
            }
            page.parentId = parentId
            page.order = order
            yMap.set(pageId, page)
        })
    }
}
