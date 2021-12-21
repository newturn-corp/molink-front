import { makeAutoObservable } from 'mobx'
import { DocumentInitialInfoDTO } from '../../DTO/DocumentDto'

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
}
