import { ReactNode } from 'react'

class Command {
    name: string
    description: string
    imgSrc: string | ReactNode
    className: string | undefined
    imgType: 'img' | 'svg'

    constructor (name: string, description: string, imgSrc: string | ReactNode, className: string | undefined = undefined, imgType: 'img' | 'svg' = 'img') {
        this.name = name
        this.description = description
        this.imgSrc = imgSrc
        this.className = className
        this.imgType = imgType
    }
}
export default Command
