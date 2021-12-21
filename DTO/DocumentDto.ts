import DocumentAuthority from '../domain/DocumentAuthority'
import { DocumentVisibility } from '../domain/NewDocument'

export class DocumentInitialInfoDTO {
    id: string
    userId: number
    title: string
    icon: string
    parentId: string | null
    order: number
    isChildrenOpen: boolean

    constructor (id: string, userId: number, title: string, icon: string, parentId: string | null, order: number, isChildrenOpen: boolean) {
        this.id = id
        this.userId = userId
        this.title = title
        this.icon = icon
        this.parentId = parentId
        this.order = order
        this.isChildrenOpen = isChildrenOpen
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

    constructor (id: string, userId: number, title: string, icon: string, visibility: DocumentVisibility, createdAt: Date, updatedAt: Date, authority: DocumentAuthority, content: any, contentId: string) {
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
    }
}

export class CreateDocumentDTO {
    title: string
    order: number
    icon: string
    parentId: string | null
    visibility: DocumentVisibility
    content: any

    constructor (title: string, icon: string, parentId: string | null, order: number, visibility: DocumentVisibility, content: any) {
        this.title = title
        this.icon = icon
        this.parentId = parentId
        this.order = order
        this.visibility = visibility
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

export class DeleteDocumentDTO {
    id: string
    parentId: string | null
    order: number

    constructor (id: string, parentId: string | null, order: number) {
        this.id = id
        this.parentId = parentId
        this.order = order
    }
}
