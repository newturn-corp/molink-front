export class UpdateContentDTO {
    id: string
    content: any

    constructor (id: string, content: any) {
        this.id = id
        this.content = content
    }
}

export class UploadContentImageDto {
    image: File

    constructor (image: File) {
        this.image = image
    }
}

export class UploadContentImageResponseDTO {
    url: string

    constructor (url: string) {
        this.url = url
    }
}
