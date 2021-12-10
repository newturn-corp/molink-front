export default class FileSystem {
    title: string
    hasIcon: boolean
    iconName: string
    order: number
    isFolder: boolean
    childs?: Document[]

    constructor (title: string, order: number, isFolder: boolean = false, hasIcon: boolean = false, iconName: string = '', childs: Document[] = []) {
        this.title = title
        this.hasIcon = hasIcon
        this.iconName = iconName
        this.order = order
        this.isFolder = isFolder
        this.childs = childs
    }
}
