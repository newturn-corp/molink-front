import { DocumentSelection } from '../DTO/DocumentDto'
import { DocumentVisibility } from './Document'
import DocumentAuthority from './DocumentAuthority'

export class OpenedDocumentInfo {
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
