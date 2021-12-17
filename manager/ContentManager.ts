import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'
import ContentAPI from '../api/ContentAPI'
import Document from '../domain/Document'
import NotificationManager, { NOTIFICATION_TYPE } from './NotificationManager'

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

    renameDocumentTitle (title: string) {
        this.openedDocument.title = title
    }

    async openDocument (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            return
        }
        if (!document.content) {
            document.content = await ContentAPI.getContentByDocument(document)
        }
        this.content = document.content
        this.openedDocument = document
    }

    async saveContent (isAutoSaving: boolean = false) {
        if (this.preventSaving) {
            return
        }
        this.preventSaving = true
        setTimeout(() => {
            this.preventSaving = false
        }, 5000)
        NotificationManager.showNotification(NOTIFICATION_TYPE.SUCCESS, isAutoSaving ? '자동 저장 중..' : '저장 중..', '', 3)
        await ContentAPI.updateContent(this.openedDocument, this.content)
        this.openedDocument.content = this.content
    }

    async handleOnChange () {
        if (this.existAutoSavingTimeout) {
            return
        }
        this.existAutoSavingTimeout = true
        setTimeout(async () => {
            await this.saveContent(true)
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
            console.log('나123 호출')
            e.preventDefault()
            editor.insertText('\n')
            break
        case 'Enter':
            if (editor.children[editor.selection.anchor.path[0]].type === 'code') {
                e.preventDefault()
                editor.insertText('\n')
            }
            break
        case 'ctrl+O':
        case 'ctrl+o':
            e.preventDefault()
            editor.insertText('sdksdkds')
            break
        case 'ctrl+z':
            e.preventDefault()
            editor.undo()
            break
        case 'ctrl+y':
            e.preventDefault()
            editor.redo()
            break
        case 'ctrl+s':
        case 'ctrl+S':
            e.preventDefault()
            await this.saveContent()
            break
        case 'ctrl+k':
            e.preventDefault()
            console.log(editor.children)
        }
    }
}
export default new ContentManager()
