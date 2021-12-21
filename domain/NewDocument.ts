import { computed, makeAutoObservable, makeObservable, observable, toJS } from 'mobx'
import DocumentAuthority from './DocumentAuthority'

export enum DocumentVisibility {
    Public = 'public',
    Private = 'private',
    OnlyFriend = 'only_friend'
}

export default class DocumentContent {
    id: string
    title: string
    icon: string
    visibility: DocumentVisibility
    content: Array<any> = null
    authority: DocumentAuthority = null

    constructor (id: string | null, title: string, icon: string, visibility: DocumentVisibility = DocumentVisibility.Private, content: Array<any>, authority: DocumentAuthority) {
        // makeAutoObservable(this)
        this.id = id
        this.title = title
        this.icon = icon
        this.visibility = visibility
        this.content = content
        this.authority = authority
        makeAutoObservable(this)
    }
}
