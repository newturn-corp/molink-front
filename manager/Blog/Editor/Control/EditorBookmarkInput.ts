import React, { ChangeEvent } from 'react'
import { CSSPosition } from '../../../global/Menu/MenuManager'
import { makeAutoObservable } from 'mobx'
import EventManager from '../../../global/Event/EventManager'
import { Event } from '../../../global/Event/Event'
import { isURL } from 'class-validator'
import EditorPage from '../EditorPage'
import { Path, Transforms } from 'slate'
import { InputRef } from 'antd'

export class EditorBookmarkInput {
    bookmarkInputRef: React.MutableRefObject<HTMLDivElement> = null
    inputRef: React.MutableRefObject<InputRef> = null
    tempBookmarkPath: Path = null
    isOpen: boolean = false
    content: string = ''
    helperText: string = undefined
    isError: boolean = false

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.PageBodyClick, () => {
            this.isOpen = false
        }, 1)
    }

    open (tempBookmarkPath: Path, position: CSSPosition, margin: number = 100) {
        const bookmarkInputElement = this.bookmarkInputRef.current
        this.tempBookmarkPath = tempBookmarkPath
        setTimeout(() => {
            if (globalThis.document.body.clientHeight < position.top + bookmarkInputElement.offsetHeight + margin) {
                bookmarkInputElement.style.top = `${position.top - bookmarkInputElement.offsetHeight - 5}px`
            } else {
                bookmarkInputElement.style.top = `${position.top + 5}px`
            }
            if (global.document.body.clientWidth < position.left + bookmarkInputElement.offsetWidth + margin) {
                bookmarkInputElement.style.left = `${position.left - bookmarkInputElement.offsetWidth}px`
            } else {
                bookmarkInputElement.style.left = `${position.left}px`
            }
            this.isOpen = true
            this.inputRef.current.focus()
        }, 0)
    }

    public close () {
        this.content = ''
        this.isOpen = false
        this.helperText = undefined
        this.isError = false
    }

    public handleChange (value: string) {
        this.content = value
        if (this.content.length > 0 && !isURL(this.content)) {
            this.helperText = '링크 형식이 아닙니다.'
            this.isError = true
        } else {
            this.isError = false
            this.helperText = undefined
        }
    }

    public handleEnter () {
        if (!isURL(this.content)) {
            this.helperText = '링크 형식이 아닙니다.'
            this.isError = true
            return
        }

        const slateEditor = EditorPage.editor.slateEditor
        Transforms.setNodes(slateEditor, {
            type: 'bookmark',
            url: this.content,
            children: [{ text: '' }]
        }, {
            at: this.tempBookmarkPath
        })
        this.close()
    }
}
