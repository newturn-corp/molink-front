import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../../api/DocumentAPI'
import ViewerAPI from '../../api/ViewerAPI'
import { SetDocumentIconDTO, SetDocumentIsChildrenOpenDTO, SetDocumentLocationDTO, SetDocumentTitleDTO, SetDocumentVisibilityDTO } from '../../DTO/DocumentDto'
import DialogManager from '../../manager/global/DialogManager'
import DocumentHierarchyManager from '../../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'
import DocumentHierarchyInfo from './DocumentHierarchyInfo'
import DocumentMeta, { DocumentVisibility } from './DocumentMeta'

export default class Document {
    meta: DocumentMeta
    hierarchyInfo: DocumentHierarchyInfo
    content: any = []

    constructor (id: string, title: string, icon: string, parentId: string | null, order: number, isChildrenOpen: boolean) {
        makeAutoObservable(this)
        this.meta = new DocumentMeta(id, title, icon)
        this.hierarchyInfo = new DocumentHierarchyInfo(parentId, order, isChildrenOpen)
    }

    getChildrenCount () {
        return this.hierarchyInfo.children.reduce((prev, current) => {
            return prev + current.getChildrenCount() + 1
        }, 0)
    }

    async setDocumentTitle (title: string) {
        this.meta.title = title
        await DocumentAPI.setDocumentTitle(new SetDocumentTitleDTO(this.meta.id, title))
    }

    async setDocumentIcon (icon: string) {
        this.meta.icon = icon
        await DocumentAPI.setDocumentIcon(new SetDocumentIconDTO(this.meta.id, icon))
    }

    equal (document: Document) {
        return document.meta.id === this.meta.id
    }

    // async setRepresentative (representative: boolean) {
    //     this.representative = representative
    //     if (representative && UserManager.representativeDocumentId) {
    //         DocumentManager.documentMap.get(UserManager.representativeDocumentId).meta.representative = false
    //         UserManager.representativeDocumentId = this.id
    //     }
    //     await DocumentAPI.setDocumentRepresentative(new UpdateDocumentRepresentativeDTO(this.id, representative))
    // }

    setDocumentViewInfo (visibility: DocumentVisibility, content: any) {
        this.meta.visibility = visibility
        this.content = content
    }

    async setIsChildrenOpen (isChildrenOpen: boolean) {
        this.hierarchyInfo.isChildrenOpen = isChildrenOpen
        await DocumentAPI.setDocumentIsChildrenOpen(new SetDocumentIsChildrenOpenDTO(this.meta.id, isChildrenOpen))
    }

    async delete () {

    }

    getSibling () {
        // return this.hierarchyInfo.parent ? this.hierarchyInfo.parent.hierarchyInfo.children : DocumentHierarchyManager.hierarchy.documents
    }

    async changeDocumentVisibility (visibility: DocumentVisibility, force: boolean = false) {
        // 변하지 않는 경우, 따로 처리하지 않는다.
        if (this.meta.visibility === visibility) {
            return
        }

        // 자식의 공개 범위는 부모의 공개 범위보다 항상 좁거나 같다.가 전제.
        // 현재의 공개 범위보다 좁히는 경우, 자식들도 안 보이게 되는 문제가 있다.
        // TODO: 현재로써는 문서를 열기 전에 공개범위를 확인할 일이 없으므로 일단 프론트에서는 상위, 하위 문서의 공개 범위도 같이 업데이트 하지 않는다.
        if (this.meta.visibility > visibility) {
            // 만약 공개 범위가 변환하는 공개 범위보다 넓은 자식이 있다면 경고해야 한다.
            if (this.hierarchyInfo.children.filter(child => child.meta.visibility > visibility).length > 0) {
                if (!force) {
                    const action = await DialogManager.openDialog('하위 문서 범위 변경', `이 문서의 하위 문서 중, '${Document.visibilityToText(visibility)}'보다 넓은 공개 범위의 문서가 있습니다. 이 문서의 공개 범위를 변경하면 하위 문서의 공개 범위도 같이 변경됩니다. 변경하시겠습니까?`, ['변경'])
                    if (action === -1) {
                        return
                    }
                }
                Document.topDownUpdateVisibility(this, visibility)
            }
        } else {
        // 현재의 범위보다 넓히는 경우, 부모의 접근 범위로 인해 자식이 보이지 않는 문제가 있다.
            const parent = this.hierarchyInfo.parent
            if (parent) {
                if (parent.meta.visibility < visibility) {
                    if (!force) {
                        const action = await DialogManager.openDialog('상위 문서 범위 변경', `이 문서의 상위 문서의 공개 범위가 '${Document.visibilityToText(visibility)}'보다 좁습니다. 이 문서의 공개 범위를 변경하면 상위 문서의 공개 범위도 같이 변경됩니다. 변경하시겠습니까?`, ['변경'])
                        if (action === -1) {
                            return
                        }
                    }

                    Document.bottomUpUpdateVisibility(this, visibility)
                }
            }
        }
        this.meta.visibility = visibility
        await DocumentAPI.setDocumentVisibility(new SetDocumentVisibilityDTO(this.meta.id, visibility))
    }

    static topDownUpdateVisibility (document: Document, visibility: DocumentVisibility) {
        document.meta.visibility = visibility
        if (document.hierarchyInfo.children.length === 0) {
            return
        }
        for (const child of document.hierarchyInfo.children) {
            if (child.meta.visibility > visibility) {
                Document.topDownUpdateVisibility(child, visibility)
            }
        }
    }

    static bottomUpUpdateVisibility (document: Document, visibility: DocumentVisibility) {
        document.meta.visibility = visibility
        if (document.hierarchyInfo.parent) {
            if (document.hierarchyInfo.parent.meta.visibility < visibility) {
                Document.bottomUpUpdateVisibility(document.hierarchyInfo.parent, visibility)
            }
        }
    }

    async setDocumentLocation (parent: Document | null, order: number): Promise<void> {
        // // 만약 새로 추가된 부모가 이 문서보다 공개범위가 좁은 경우
        // if (parent && parent.meta.visibility < this.meta.visibility) {
        //     const index = await DialogManager.openDialog('공개 범위 주의', `새로운 상위 문서의 공개 범위가 현재 공개 범위인 '${Document.visibilityToText(this.meta.visibility)}'보다 좁습니다.`, ['상위 문서의 공개 범위 넓히기', '이 문서와 하위 문서의 공개 범위 좁히기'])
        //     if (index === -1) {
        //         return
        //     }
        //     if (index === 0) {
        //         await parent.changeDocumentVisibility(this.meta.visibility, true)
        //     }
        //     if (index === 1) {
        //         await this.changeDocumentVisibility(parent.meta.visibility, true)
        //     }
        // }
        // // 기존 부모에게서 삭제
        // if (this.hierarchyInfo.parent === null) {
        //     DocumentHierarchyManager.hierarchy.documents.filter(info => info.hierarchyInfo.order > this.hierarchyInfo.order).forEach(info => { info.hierarchyInfo.order -= 1 })
        //     DocumentHierarchyManager.hierarchy.documents.splice(this.hierarchyInfo.order, 1)
        // } else {
        //     this.hierarchyInfo.parent.hierarchyInfo.children.filter(doc => doc.hierarchyInfo.order > this.hierarchyInfo.order).forEach(info => { info.hierarchyInfo.order -= 1 })
        //     this.hierarchyInfo.parent.hierarchyInfo.children.splice(this.hierarchyInfo.order, 1)
        // }

        // const [parentIdBefore, orderBefore] = [this.hierarchyInfo.parent ? this.hierarchyInfo.parent.meta.id : null, this.hierarchyInfo.order]
        // const parentId = parent ? parent.meta.id : null
        // this.hierarchyInfo.parent = parent
        // this.hierarchyInfo.order = order
        // this.hierarchyInfo.parentId = parentId

        // // 새 부모에게 추가
        // if (this.hierarchyInfo.parent === null) {
        //     DocumentHierarchyManager.hierarchy.documents.filter(info => info.hierarchyInfo.order >= this.hierarchyInfo.order).forEach(info => { info.hierarchyInfo.order += 1 })
        //     DocumentHierarchyManager.hierarchy.documents.splice(this.hierarchyInfo.order, 0, this)
        // } else {
        //     this.hierarchyInfo.parent.hierarchyInfo.children.filter(info => info.hierarchyInfo.order >= this.hierarchyInfo.order).forEach(info => { info.hierarchyInfo.order += 1 })
        //     this.hierarchyInfo.parent.hierarchyInfo.children.splice(this.hierarchyInfo.order, 0, this)
        //     if (this.hierarchyInfo.isOpen) {
        //         this.hierarchyInfo.parent.hierarchyInfo.isChildrenOpen = true
        //     }
        // }
        // await DocumentAPI.setDocumentLocation(new SetDocumentLocationDTO(this.meta.id, parentIdBefore, parentId, orderBefore, order))
    }

    static visibilityToText (visibility: DocumentVisibility) {
        switch (visibility) {
        case DocumentVisibility.Private:
            return '비공개'
        case DocumentVisibility.OnlyFollower:
            return '팔로워만'
        case DocumentVisibility.Public:
            return '전체 공개'
        }
    }

    // static async create (parent: Document | null, order: number): Promise<Document> {
    //     // const parentId = parent ? parent.meta.id : null
    //     // const id = await DocumentAPI.createDocument(new CreateDocumentDTO(parentId, order))
    //     // const hierarchyInfo = await ViewerAPI.getDocumentHierarchyInfo(id)
    //     // const document = new Document(hierarchyInfo.id, hierarchyInfo.title, hierarchyInfo.icon, hierarchyInfo.parentId, hierarchyInfo.order, hierarchyInfo.isChildrenOpen)
    //     // return document
    // }
}
