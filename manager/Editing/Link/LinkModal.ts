import { makeAutoObservable } from 'mobx'
import isUrl from 'is-url'
import React, { ChangeEvent } from 'react'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { Editor, Range, Transforms } from 'slate'
import EditorPage from '../../Blog/Editor/EditorPage'

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

    getInsertPosition (editor: Editor) {
        const { selection } = editor
        if (selection) {
            return Range.edges(selection)[0]
        } else if (EditorPage.editor.lastSelection) {
            return Range.edges(EditorPage.editor.lastSelection)[0]
        }
        return [editor.children.length]
    }

    public async handleOk () {
        if (!isUrl(this.content)) {
            this.helperText = '링크 형식이 아닙니다.'
            this.isError = true
            return
        }

        const slateEditor = EditorPage.editor.slateEditor
        Transforms.insertNodes(slateEditor, {
            type: 'bookmark',
            url: this.content,
            children: [{ text: '' }]
        }, {
            at: this.getInsertPosition(slateEditor)
        })
        this.close()
    }
}
