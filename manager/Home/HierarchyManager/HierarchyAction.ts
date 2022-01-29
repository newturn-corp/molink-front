import { CreateDocumentDTO, HierarchyActionDTO } from '@newturn-develop/types-molink/dist/DTO'

export enum HierarchyActionType {
    CreateDocument,
    DeleteDocument
}

export abstract class HierarchyAction {
    type: HierarchyActionType
    dto: HierarchyActionDTO

    constructor (dto: HierarchyActionDTO) {
        this.dto = dto
    }
}

export class CreateDocumentAction extends HierarchyAction {
    type: HierarchyActionType.CreateDocument
    dto: CreateDocumentDTO
}
