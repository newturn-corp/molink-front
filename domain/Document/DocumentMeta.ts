import { makeAutoObservable } from 'mobx'

export enum DocumentVisibility {
    Private = 'private',
    OnlyFollower = 'only_follower',
    Public = 'public'
}

export default class DocumentMeta {
    id: string
    userId: number
    title: string
    icon: string
    visibility: DocumentVisibility = DocumentVisibility.Private
    representative: boolean = false
    createdAt: Date
    updatedAt: Date

    constructor (id: string, title: string, icon: string) {
        // makeAutoObservable(this)
        this.id = id
        this.title = title
        this.icon = icon
        makeAutoObservable(this)
    }
}
