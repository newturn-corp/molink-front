export class UpdateContentDTO {
    id: string
    content: any

    constructor (id: string, content: any) {
        this.id = id
        this.content = content
    }
}
