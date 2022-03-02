class Command {
    name: string
    description: string
    imgSrc: string

    constructor (name: string, description: string, imgSrc: string) {
        this.name = name
        this.description = description
        this.imgSrc = imgSrc
    }
}
export default Command
