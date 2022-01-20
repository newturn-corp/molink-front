import DocumentAuthority from '../domain/DocumentAuthority'
import { DocumentVisibility } from '../domain/Document/DocumentMeta'

export class DocumentInitialInfoDTO {
    id: string
    userId: number
    title: string
    icon: string
    parentId: string | null
    order: number
    isChildrenOpen: boolean
    representative: boolean
    visibility: DocumentVisibility

    constructor (id: string, userId: number, title: string, icon: string, parentId: string | null, order: number, isChildrenOpen: boolean, representative: boolean, visibility: DocumentVisibility) {
        this.id = id
        this.userId = userId
        this.title = title
        this.icon = icon
        this.parentId = parentId
        this.order = order
        this.isChildrenOpen = isChildrenOpen
        this.representative = representative
        this.visibility = visibility
    }
}

export class GetDocumentDto {
    id: string
    userId: number
    title: string = ''
    icon: string = ''
    visibility: DocumentVisibility = DocumentVisibility.Private
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    authority: DocumentAuthority
    contentId: string = ''
    content: any = null
    selection: DocumentSelection | null = null
    isLocked: boolean = false

    constructor (id: string, userId: number, title: string, icon: string, visibility: DocumentVisibility, createdAt: Date, updatedAt: Date, authority: DocumentAuthority, content: any, contentId: string, selection: DocumentSelection | null, isLocked: boolean) {
        this.id = id
        this.userId = userId
        this.title = title
        this.icon = icon
        this.visibility = visibility
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.authority = authority
        this.content = content
        this.contentId = contentId
        this.selection = selection
        this.isLocked = isLocked
    }
}

export class GetDocumentResponseDTO {
    title: string
    icon: string
    visibility: DocumentVisibility
    createdAt: Date
    updatedAt: Date
    representative: boolean
    authority: DocumentAuthority
    selection: DocumentSelection | null
    isLocked: boolean
    contentId: string
    content: any = {}

    constructor (title: string, icon: string, visibility: DocumentVisibility, createdAt: Date, updatedAt: Date, representative: boolean, authority: DocumentAuthority, selection: DocumentSelection | null, isLocked: boolean, contentId: string, content: any) {
        this.title = title
        this.icon = icon
        this.visibility = visibility
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.representative = representative
        this.authority = authority
        this.selection = selection
        this.isLocked = isLocked
        this.contentId = contentId
        this.content = content
    }
}

export class GetDocumentViewInfoResponseDTO {
    id: string = ''
    title: string = ''
    icon: string = ''
    userId: number = 0
    visibility: DocumentVisibility = DocumentVisibility.Private
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    authority: DocumentAuthority
    content: any = null

    constructor (id: string, title: string, icon: string, userId: number, visibility: DocumentVisibility, createdAt: Date, updatedAt: Date, authority: DocumentAuthority, content: any = null) {
        this.id = id
        this.title = title
        this.icon = icon
        this.userId = userId
        this.visibility = visibility
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.authority = authority
        this.content = content
    }
}

export class SetDocumentLocationDTO {
    id: string
    parentIdBefore: string | null
    parentId: string | null
    orderBefore: number
    order: number

    constructor (id: string, parentIdBefore: string | null, parentId: string | null, orderBefore: number, order: number) {
        this.id = id
        this.parentIdBefore = parentIdBefore
        this.parentId = parentId
        this.orderBefore = orderBefore
        this.order = order
    }
}

export class SetDocumentVisibilityDTO {
    id: string
    visibility: DocumentVisibility

    constructor (id: string, visibility: DocumentVisibility) {
        this.id = id
        this.visibility = visibility
    }
}

export class SetDocumentTitleDTO {
    id: string
    title: string

    constructor (id: string, title: string) {
        this.id = id
        this.title = title
    }
}

export class SetDocumentIsChildrenOpenDTO {
    id: string
    isChildrenOpen: boolean

    constructor (id: string, isChildrenOpen: boolean) {
        this.id = id
        this.isChildrenOpen = isChildrenOpen
    }
}

export class DeleteDocumentDTO {
    id: string
    parentId: string | null
    order: number
    contentId: string

    constructor (id: string, parentId: string | null, order: number, contentId: string) {
        this.id = id
        this.parentId = parentId
        this.order = order
        this.contentId = contentId
    }
}

export class SetDocumentIconDTO {
    id: string
    icon: string

    constructor (id: string, icon: string) {
        this.id = id
        this.icon = icon
    }
}

export class UpdateDocumentRepresentativeDTO {
    id: string
    representative: boolean

    constructor (id: string, representative: boolean) {
        this.id = id
        this.representative = representative
    }
}

export class SearchDocumentLinkResultDTO {
    id: string
    title: string
    icon: string
    userId: number

    constructor (id: string, title: string, icon: string, userId: number) {
        this.id = id
        this.title = title
        this.icon = icon
        this.userId = userId
    }
}

export class CollectDocumentDTO {
    documentId: string

    constructor (documentId: string) {
        this.documentId = documentId
    }
}

export interface DocumentSelection {
    path: number[],
    offset: number
}

export class UpdateDocumentSelectionDTO {
    documentId: string
    selection: DocumentSelection

    constructor (documentId: string, selection: DocumentSelection) {
        this.documentId = documentId
        this.selection = selection
    }
}

export class UpdateDocumentIsLockedDTO {
    documentId: string
    isLocked: boolean

    constructor (documentId: string, isLocked: boolean) {
        this.documentId = documentId
        this.isLocked = isLocked
    }
}

export class DocumentHierarchyInfoDTO {
    id: string
    title: string
    icon: string
    order: number
    parentId: string | null
    isChildrenOpen: boolean

    constructor (id: string, title: string, icon: string, order: number, parentId: string | null, isChildrenOpen: boolean) {
        this.id = id
        this.title = title
        this.icon = icon
        this.order = order
        this.parentId = parentId
        this.isChildrenOpen = isChildrenOpen
    }
}
