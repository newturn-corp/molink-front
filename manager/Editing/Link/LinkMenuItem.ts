class LinkMenuItem {
    name: string
    onClick: Function

    constructor (name: string, onClick: Function) {
        this.name = name
        this.onClick = onClick
    }
}
export default LinkMenuItem
