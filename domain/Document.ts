import { computed, makeAutoObservable, makeObservable, observable, toJS } from 'mobx'

export default class Document {
    id: string | null
    parent: Document | null
    title: string
    icon: string
    order: number
    children: Document[] = []

    isOpen: boolean = false
    isChildrenOpen: boolean = false
    isChangingName: boolean = false
    isNewDocument: boolean = false
    isSelected: boolean = false

    tryingGetOlderSibling: boolean = false
    tryingGetYoungerSibling: boolean = false

    content: Array<any> = null

    constructor (id: string | null, parent: Document | null, title: string, icon: string, order: number, children: Document[], isOpen: boolean = false, isChildrenOpen: boolean = false, isChangingName: boolean = false, isNewDocument: boolean = false) {
        // makeAutoObservable(this)
        this.id = id
        this.parent = parent
        this.title = title
        this.icon = icon
        this.order = order
        this.children = children.map(child => new Document(child.id, this, child.title, child.icon, child.order, child.children, child.isOpen, child.isChildrenOpen))
        this.isChildrenOpen = isChildrenOpen
        this.isOpen = isOpen
        this.isChangingName = isChangingName
        this.isNewDocument = isNewDocument
        makeAutoObservable(this)
    }
}
