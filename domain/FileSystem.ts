export default class FileSystem {
    title: string
    hasIcon: boolean
    iconName: string
    order: number
    isDocument: boolean
    childs?: Document[]

    constructor (title: string, order: number, isDocument: boolean = false, hasIcon: boolean = false, iconName: string = '', childs: Document[] = []) {
        this.title = title
        this.hasIcon = hasIcon
        this.iconName = iconName
        this.order = order
        this.isDocument = isDocument
        this.childs = childs
    }
}
