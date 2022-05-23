class Command {
    name: string
    description: string
    imgSrc: string
    className: string | undefined

    constructor (name: string, description: string, imgSrc: string, className: string | undefined = undefined) {
        this.name = name
        this.description = description
        this.imgSrc = imgSrc
        this.className = className
    }
}
export default Command
