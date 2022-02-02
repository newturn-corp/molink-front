import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import { CollectDocumentDTO, DeleteDocumentDTO, DocumentInitialInfoDTO, SetDocumentVisibilityDTO, UpdateDocumentIsLockedDTO } from '../DTO/DocumentDto'
import EventManager, { Event } from '../manager/EventManager'
import DocumentManager from '../manager/DocumentManager'
import FileSystemManager from '../manager/Home/Hierarchy/HierarchyManager'
import UserManager from '../manager/global/UserManager'
import { TextCategory } from '../Types/slate/CustomElement'
import DocumentAuthority from './DocumentAuthority'
import DocumentDirectoryInfo from './DocumentDirectoryInfo'
import DocumentMeta from './DocumentMeta'
import DialogManager from '../manager/global/DialogManager'

export enum DocumentVisibility {
    Private = 0,
    OnlyFriend = 1,
    Public = 2
}

export default class Document {
    meta: DocumentMeta
    directoryInfo: DocumentDirectoryInfo
    content = []
    contentId: string = ''
    authority: DocumentAuthority = new DocumentAuthority(false, false)
    isLocked: boolean = false

    constructor (dto: DocumentInitialInfoDTO) {
        makeAutoObservable(this)
        this.meta = new DocumentMeta(dto)
        this.directoryInfo = new DocumentDirectoryInfo(this, this.meta, dto)
    }

    async delete () {
        await EventManager.issueEvent(Event.DeleteDocument, { document: this })
        await DocumentAPI.deleteDocument(new DeleteDocumentDTO(this.meta.id, this.directoryInfo.parentId, this.directoryInfo.order, this.contentId))
        this.directoryInfo.delete()
    }

    static visibilityToText (visibility: DocumentVisibility) {
        switch (visibility) {
        case DocumentVisibility.Private:
            return '비공개'
        case DocumentVisibility.OnlyFriend:
            return '팔로워만'
        case DocumentVisibility.Public:
            return '전체 공개'
        }
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
            if (this.directoryInfo.children.filter(child => child.meta.visibility > visibility).length > 0) {
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
            const parent = this.directoryInfo.parent
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
        // await DocumentAPI.setDocumentVisibility(new SetDocumentVisibilityDTO(this.meta.id, visibility))
    }

    static topDownUpdateVisibility (document: Document, visibility: DocumentVisibility) {
        document.meta.visibility = visibility
        if (document.directoryInfo.children.length === 0) {
            return
        }
        for (const child of document.directoryInfo.children) {
            if (child.meta.visibility > visibility) {
                Document.topDownUpdateVisibility(child, visibility)
            }
        }
    }

    static bottomUpUpdateVisibility (document: Document, visibility: DocumentVisibility) {
        document.meta.visibility = visibility
        if (document.directoryInfo.parent) {
            if (document.directoryInfo.parent.meta.visibility < visibility) {
                Document.bottomUpUpdateVisibility(document.directoryInfo.parent, visibility)
            }
        }
    }

    equal (document: Document) {
        return document.meta.id === this.meta.id
    }

    isChildOf (document: Document) {
        return document.directoryInfo.children.filter(doc => doc.equal(this)).length > 0
    }

    async collect () {
        await DocumentAPI.collectDocument(new CollectDocumentDTO(this.meta.id))
    }

    async updateIsLocked (isLocked: boolean) {
        this.isLocked = isLocked
        await DocumentAPI.updateDocumentIsLocked(new UpdateDocumentIsLockedDTO(this.meta.id, isLocked))
    }

    static async create (parent: Document | null, order: number) {
        const parentId = parent ? parent.meta.id : null
        // const id = await DocumentAPI.createDocument(new CreateDocumentDTO(parentId, order))

        // // 문서 신규 생성시 기본 값들
        // const defaultTitle = ''
        // const defaultIcon = '📄'
        // const defaultVisibility: DocumentVisibility = DocumentVisibility.Private
        // const defaultContent = [{
        //     type: 'title',
        //     children: [{ text: '' }]
        // }, { type: 'text', category: TextCategory.Content3, children: [{ text: '' }] }]
        // const defaultRepresentative = false
        // const defaultIsChildrenOpen = false
        // const document = new Document(new DocumentInitialInfoDTO(id, UserManager.userId, '', defaultIcon, parentId, order, false, false, defaultVisibility))
        // DocumentManager.documentMap.set(id, document)
        // // 부모에 새로운 문서 추가
        // if (parent) {
        //     parent.directoryInfo.children.splice(order, 0, document)
        //     // 부모가 있으면 자식에 부모 연결
        //     document.directoryInfo.parent = parent
        //     parent.directoryInfo.setIsChildrenOpen(true)
        // } else {
        //     FileSystemManager.documents.splice(order, 0, document)
        // }
        // document.content = defaultContent
        // return document
    }
}
