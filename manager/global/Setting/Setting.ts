export class Setting {
    name: string
    isSelected: boolean = false
    isChildrenOpen: boolean = false
    children: string[] = []

    constructor (name: string, isSelected: boolean = false) {
        this.name = name
        this.isSelected = isSelected
    }
}
