import { DocumentVisibility } from '../../domain/Document'
import DocumentAuthority from '../../domain/DocumentAuthority'
import { DocumentSelection } from '../../DTO/DocumentDto'

export enum GetDocumentFailReason {
    DocumentNotExists
}

export type GetDocumentResponse = {
    success: boolean
    reason?: GetDocumentFailReason
    id: string
    userId: number
    title: string
    icon: string
    visibility: DocumentVisibility
    createdAt: Date
    updatedAt: Date
    authority: DocumentAuthority
    contentId: string
    content: any
    selection: DocumentSelection | null
    isLocked: boolean
}
