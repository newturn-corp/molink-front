import { makeAutoObservable } from 'mobx'
import Document from './Document'

export default class DocumentHierarchyInfo {
    parentId: string | null
    order: number
    isChildrenOpen: boolean = false
    parent: Document | null = null
    children: Document[] = []

    isChangingName: boolean = false
    isSelected: boolean = false
    isOpen: boolean = false

    constructor (parentId: string | null, order: number, isChildrenOpen: boolean) {
        this.parentId = parentId
        this.order = order
        this.isChildrenOpen = isChildrenOpen
        makeAutoObservable(this, {
            parent: false
        })
    }
}
