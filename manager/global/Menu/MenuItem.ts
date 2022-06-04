import { ReactNode } from 'react'

class MenuItem {
    name: string
    onClick: Function
    icon: ReactNode = null

    constructor (name: string, onClick: Function, icon: ReactNode = null) {
        this.name = name
        this.onClick = onClick
        this.icon = icon
    }
}
export default MenuItem
