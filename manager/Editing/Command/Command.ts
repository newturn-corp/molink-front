import { ReactNode } from 'react'
import { reaction } from 'mobx'
import LanguageManager from '../../global/LanguageManager'

class Command {
    nameKey: string
    name: string
    description: string
    imgSrc: string | ReactNode
    className: string | undefined
    imgType: 'img' | 'svg'

    constructor (nameKey: string, description: string, imgSrc: string | ReactNode, className: string | undefined = undefined, imgType: 'img' | 'svg' = 'img') {
        this.nameKey = nameKey
        this.name = nameKey
        this.description = description
        this.imgSrc = imgSrc
        this.className = className
        this.imgType = imgType

        reaction(() => LanguageManager.languageMap[nameKey], (value) => {
            this.name = LanguageManager.languageMap[nameKey]
        })

        reaction(() => LanguageManager.languageMap[description], (value) => {
            this.description = LanguageManager.languageMap[description]
        })
    }
}
export default Command
