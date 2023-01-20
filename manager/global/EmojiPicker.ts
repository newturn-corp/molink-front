import React from 'react'
import { EmojiClickData } from 'emoji-picker-react'
import { CSSPosition } from './Menu/MenuManager'
import { makeAutoObservable } from 'mobx'
import EventManager from './Event/EventManager'
import { Event } from './Event/Event'

class EmojiPicker {
    isOpen: boolean = false
    pickerRef: React.MutableRefObject<HTMLDivElement> = null
    disableSearchbar: boolean = false
    onEmojiClick: (data: EmojiClickData) => void

    constructor () {
        makeAutoObservable(this)
    }

    open (position: CSSPosition, onEmojiClick: (data: EmojiClickData) => void, disableSearchbar: boolean = false, margin: number = 100) {
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
        EventManager.addDisposableEventListener(Event.PageBodyClick, () => {
            this.close()
        }, 1)
    }

    close () {
        this.isOpen = false
        this.pickerRef.current.removeAttribute('style')
    }
}
export default new EmojiPicker()
