import { makeAutoObservable } from 'mobx'

export interface TextColorStyleInterface {
    primary: string
}

const defaultTextColorStyle = {
    primary: '#212B36'
}

export class ColorStyle {
    text: TextColorStyleInterface = defaultTextColorStyle

    constructor () {
        makeAutoObservable(this)
    }
}
