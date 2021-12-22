import { makeAutoObservable } from 'mobx'
import DocumentAPI from '../api/renew/DocumentAPI'
import { DocumentInitialInfoDTO, SetDocumentIconDTO, SetDocumentTitleDTO } from '../DTO/DocumentDto'

export enum DocumentVisibility {
    Public = 'public',
    Private = 'private',
    OnlyFriend = 'only_friend'
}

export default class DocumentMeta {
    id: string | null
    userId: number
    title: string
    icon: string
    visibility: DocumentVisibility = DocumentVisibility.Private

    constructor (dto: DocumentInitialInfoDTO) {
        // makeAutoObservable(this)
        this.id = dto.id
        this.userId = dto.userId
        this.title = dto.title
        this.icon = dto.icon
        makeAutoObservable(this)
    }

    async setDocumentTitle (title: string) {
        this.title = title
        await DocumentAPI.setDocumentTitle(new SetDocumentTitleDTO(this.id, title))
    }

    async setDocumentIcon (icon: string) {
        this.icon = icon
        await DocumentAPI.setDocumentIcon(new SetDocumentIconDTO(this.id, icon))
    }
}
