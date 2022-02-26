import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import { DocumentInitialInfoDTO, SetDocumentIconDTO, SetDocumentTitleDTO, UpdateDocumentRepresentativeDTO } from '../DTO/DocumentDto'
import DocumentManager from '../manager/DocumentManager'
import UserManager from '../manager/global/UserManager'

export enum DocumentVisibility {
    Private = 0,
    OnlyFriend = 1,
    Public = 2
}

export default class DocumentMeta {
    id: string | null
    userId: number
    title: string
    icon: string
    visibility: DocumentVisibility = DocumentVisibility.Private
    representative: boolean = false

    constructor (dto: DocumentInitialInfoDTO) {
        // makeAutoObservable(this)
        this.id = dto.id
        this.userId = dto.userId
        this.title = dto.title
        this.icon = dto.icon
        this.representative = dto.representative
        // this.visibility = dto.visibility
        makeAutoObservable(this)
    }

    async setDocumentTitle (title: string) {
        this.title = title
        // await DocumentAPI.setDocumentTitle(new SetDocumentTitleDTO(this.id, title))
    }

    async setDocumentIcon (icon: string) {
        this.icon = icon
        await DocumentAPI.setDocumentIcon(new SetDocumentIconDTO(this.id, icon))
    }

    async setRepresentative (representative: boolean) {
        this.representative = representative
        if (representative && UserManager.profile.representativeDocumentId) {
            DocumentManager.documentMap.get(UserManager.profile.representativeDocumentId).meta.representative = false
            UserManager.profile.representativeDocumentId = this.id
        }
        await DocumentAPI.setDocumentRepresentative(new UpdateDocumentRepresentativeDTO(this.id, representative))
    }
}
