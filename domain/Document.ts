export default class Document {
    title: string
    order: number
    children: Document[] = []

    constructor (title: string, order: number, children: Document[]) {
        this.title = title
        this.order = order
        this.children = children.map(child => new Document(child.title, child.order, child.children))
    }
}
