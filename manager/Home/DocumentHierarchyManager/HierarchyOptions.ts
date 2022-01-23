import { CreateDocumentDTO } from '@newturn-develop/types-molink/dist/DTO'
import EventManager, { Event } from '../../EventManager'
import RoutingManager, { Page } from '../../global/RoutingManager'
import DocumentHierarchyManager from './DocumentHierarchyManager'
import LiveServer from '../../../LiveServer/HierarchyLiveServer'
export abstract class HierarchyControlOption {
    name: string = ''
    documentId: string | null

    constructor (documentId: string | null) {
        this.documentId = documentId
    }

    abstract handleOnClick ()
}

export class CreateNewDocumentOption extends HierarchyControlOption {
    constructor (documentId: string | null) {
        super(documentId)
        this.name = documentId ? '하위 문서 생성' : '문서 생성'
    }

    getOrder () {
        if (this.documentId) {
            const block = DocumentHierarchyManager.hierarchy.getDocumentHierarchyBlockById(this.documentId)
            return block.children.length
        } else {
            return DocumentHierarchyManager.hierarchy.list.length
        }
    }

    getLocation (order: number) {
        if (this.documentId) {
            const document = DocumentHierarchyManager.hierarchy.map[this.documentId]
            return document.location + ',' + order
        } else {
            return order.toString()
        }
    }

    async handleOnClick () {
        const order = this.getOrder()
        const location = this.getLocation(order)
        console.log('createDocument')
        const { documentId: newDocumentId } = await LiveServer.createDocument(new CreateDocumentDTO(location, this.documentId, order))
        console.log('response')
        DocumentHierarchyManager.hierarchy.setSelectedDocumentId(null)
        console.log(newDocumentId)
        // RoutingManager.moveTo(Page.Index, `?id=${newDocumentId}`)
        // ReactEditor.focus(editor)
        // Transforms.select(editor, [0, 0])
    }
}

// export class ChangeDocumentNameOption extends HierarchyControlOption {
//     name = '문서 이름 변경'

//     handleOnClick () {
//         this.document.hierarchyInfo.isChangingName = true
//         this.hierarchy.removeSelect()
//     }
// }

// export class DeleteDocumentOption extends HierarchyControlOption {
//     name = '문서 삭제'

//     async handleOnClick () {
//         const childrenCount = this.document.getChildrenCount()
//         const msg = childrenCount > 0 ? `${this.document.meta.title} 문서와 그 하위 문서 ${childrenCount}개를 모두 제거합니다.` : `${this.document.meta.title} 문서를 제거합니다.`
//         const index = await DialogManager.openDialog('문서 삭제', msg, ['확인'])
//         if (index !== 0) {
//             return
//         }
//         await this.document.delete()
//         this.hierarchy.removeSelect()
//     }
// }

// export class SettingDocumentListOption extends HierarchyControlOption {
//     name = '문서 목록 설정'

//     handleOnClick () {
//         this.hierarchy.removeSelect()
//         RoutingManager.moveTo(Page.SettingDocumentList)
//     }
// }
