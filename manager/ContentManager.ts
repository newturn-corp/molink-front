import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'
import ContentAPI from '../api/ContentAPI'
import Document from '../domain/Document'

class ContentManager {
    _content: any = null

    get content () {
        return toJS(this._content)
    }

    set content (content) {
        this._content = content
    }

    openedDocument: Document = null

    existAutoSavingTimeout: boolean = false
    preventSaving: boolean = false

    constructor () {
        makeAutoObservable(this)
    }

    async openDocument (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            return
        }
        if (!document.content) {
            document.content = await ContentAPI.getContentByDocument(document)
        }
        console.log(document.content)
        this.content = document.content
        this.openedDocument = document
    }

    async updateContent () {
        if (this.preventSaving) {
            return
        }
        this.preventSaving = true
        setTimeout(() => {
            this.preventSaving = false
        }, 5000)
        await ContentAPI.updateContent(this.openedDocument, this.content)
        this.openedDocument.content = this.content
    }

    async handleOnChange () {
        if (this.existAutoSavingTimeout) {
            return
        }
        this.existAutoSavingTimeout = true
        console.log('자동 저장 타이머 시작')
        setTimeout(async () => {
            await this.updateContent()
            this.existAutoSavingTimeout = false
        }, 60000)
    }

    async handleKeyDown (editor: BaseEditor & ReactEditor & HistoryEditor, e: React.KeyboardEvent<HTMLDivElement>) {
        const keys = []
        if (e.shiftKey) {
            keys.push('shift')
        } else if (e.altKey) {
            keys.push('alt')
        } else if (e.ctrlKey) {
            keys.push('ctrl')
        }
        keys.push(e.key)
        switch (keys.join('+')) {
        case 'shift+Enter':
            console.log('나 호출')
            e.preventDefault()
            editor.insertText('\n')
            break
        case 'ctrl+s':
        case 'ctrl+S':
            e.preventDefault()
            await this.updateContent()
        }
    }
}
export default new ContentManager()
