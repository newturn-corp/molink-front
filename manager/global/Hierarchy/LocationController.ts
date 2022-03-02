import Hierarchy from './Hierarchy'

export class LocationController {
    private readonly hierarchy: Hierarchy

    constructor (hierarchy) {
        this.hierarchy = hierarchy
    }

    public updatePageLocation (pageId: string, parentId: string | null, order: number) {
        const {
            yDocument,
            yMap,
            yTopLevelDocumentIdList,
            editable
        } = this.hierarchy

        if (!editable) {
            return
        }

        yDocument.transact(() => {
            const document = yMap.get(pageId)
            // 기존 부모에서 제거하고 order 조정
            if (!document.parentId) {
                yTopLevelDocumentIdList.delete(document.order, 1)
                for (const [index, documentId] of yTopLevelDocumentIdList.toArray().entries()) {
                    const siblingDocument = yMap.get(documentId)
                    siblingDocument.order = index
                    yMap.set(siblingDocument.id, siblingDocument)
                }
            } else {
                const parent = yMap.get(document.parentId)
                parent.children.splice(document.order, 1)
                for (const [index, documentId] of parent.children.entries()) {
                    const siblingDocument = yMap.get(documentId)
                    siblingDocument.order = index
                    yMap.set(documentId, siblingDocument)
                }
                yMap.set(parent.id, parent)
            }
            // 새로운 부모에 추가하고 order 조정
            if (!parentId) {
                yTopLevelDocumentIdList.insert(order, [pageId])
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
            document.parentId = parentId
            document.order = order
            yMap.set(pageId, document)
        })
    }
}
