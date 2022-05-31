import React from 'react'
import { IEmojiData } from 'emoji-picker-react'
import { CSSPosition } from './Menu/MenuManager'
import { makeAutoObservable } from 'mobx'

class EmojiPicker {
    isOpen: boolean = false
    pickerRef: React.MutableRefObject<HTMLDivElement> = null
    disableSearchbar: boolean = false
    onEmojiClick: (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => void

    constructor () {
        makeAutoObservable(this)
    }

    open (position: CSSPosition, onEmojiClick: (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => void, disableSearchbar: boolean = false, margin: number = 100) {
        this.onEmojiClick = onEmojiClick
        this.disableSearchbar = disableSearchbar
        const pickerElement = this.pickerRef.current
        setTimeout(() => {
            if (globalThis.document.body.clientHeight < position.top + pickerElement.offsetHeight + margin) {
                pickerElement.style.top = `${position.top - pickerElement.offsetHeight - 5}px`
            } else {
                pickerElement.style.top = `${position.top + 5}px`
            }
            if (global.document.body.clientWidth < position.left + pickerElement.offsetWidth + margin) {
                pickerElement.style.left = `${position.left - pickerElement.offsetWidth}px`
            } else {
                pickerElement.style.left = `${position.left}px`
            }
            this.isOpen = true
        }, 0)
    }

    close () {
        this.isOpen = false
    }
}
export default new EmojiPicker()
