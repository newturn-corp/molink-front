import { makeAutoObservable } from 'mobx'
import isUrl from 'is-url'
import React, { ChangeEvent } from 'react'
import { TextAreaRef } from 'antd/es/input/TextArea'
import EditorManager from '../../Blog/EditorManager'
import { Transforms } from 'slate'

export class LinkModal {
    isOpen: boolean = false
    content: string = ''
    contentRef: React.MutableRefObject<TextAreaRef> = null
    helperText: string = undefined
    isError: boolean = false

    constructor () {
        makeAutoObservable(this)
    }

    public close () {
        this.content = ''
        this.isOpen = false
        this.helperText = undefined
        this.isError = false
    }

    public async open () {
        const data = await navigator.clipboard.readText()
        if (isUrl(data)) {
            this.content = data
        }
        this.isOpen = true
        this.contentRef.current.focus()
    }

    public handleChange (event: ChangeEvent<HTMLTextAreaElement>) {
        this.content = event.target.value
        if (this.content.length > 0 && !isUrl(this.content)) {
            this.helperText = '링크 형식이 아닙니다.'
            this.isError = true
        } else {
            this.isError = false
            this.helperText = undefined
        }
    }

    public async handleOk () {
        if (!isUrl(this.content)) {
            this.helperText = '링크 형식이 아닙니다.'
            this.isError = true
            return
        }
        Transforms.insertNodes(EditorManager.slateEditor, {
            type: 'bookmark',
            url: this.content,
            children: [{ text: '' }]
        }, {
            at: [EditorManager.slateEditor.children.length]
        })
        this.close()
    }
}
