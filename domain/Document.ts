import { computed, makeAutoObservable, makeObservable, observable, toJS } from 'mobx'

export default class Document {
    id: string | null
    parent: Document | null
    title: string
    icon: string
    order: number
    children: Document[] = []

    isOpen: boolean = false
    isChangingName: boolean = false
    isNewDocument: boolean = false
    isSelected: boolean = false

    tryingGetOlderSibling: boolean = false
    tryingGetYoungerSibling: boolean = false

    content: Array<any> = null

    constructor (id: string | null, parent: Document | null, title: string, icon: string, order: number, children: Document[], isOpen: boolean = false, isChangingName: boolean = false, isNewDocument: boolean = false) {
        // makeAutoObservable(this)
        this.id = id
        this.parent = parent
        this.title = title
        this.icon = icon
        this.order = order
        this.children = children.map(child => new Document(child.id, this, child.title, child.icon, child.order, child.children, child.isOpen))
        this.isOpen = isOpen
        this.isChangingName = isChangingName
        this.isNewDocument = isNewDocument
        // makeObservable(this, {
        //     id: observable,
        //     title: observable,
        //     icon: observable,
        //     children: computed,
        //     isOpen: observable,
        //     isChangingName: observable,
        //     isNewDocument: observable,
        //     isSelected: observable,
        //     tryingGetOlderSibling: observable,
        //     tryingGetYoungerSibling: observable
        // })
        makeAutoObservable(this)
    }
}
