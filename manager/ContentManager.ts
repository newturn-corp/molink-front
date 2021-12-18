import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseEditor, Editor, Range } from 'slate'
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

    _openedDocument: Document = null
    get openedDocument () {
        return toJS(this._openedDocument)
    }

    set openedDocument (openedDocument) {
        console.log(openedDocument)
        this._openedDocument = openedDocument
    }

    existAutoSavingTimeout: boolean = false
    preventSaving: boolean = false

    constructor () {
        makeAutoObservable(this)
    }

    renameDocumentTitle (title: string) {
        this.openedDocument.title = title
    }

    async openDocument (document: Document) {
        console.log(document)
        console.log(this.openedDocument)
        if (this.openedDocument && document.id === this.openedDocument.id) {
            return
        }
        if (!document.content) {
            document.content = await ContentAPI.getContentByDocument(document)
        }
        this.openedDocument = document
        // this.content = document.content
    }

    async saveContent (isAutoSaving: boolean = false) {
        if (this.preventSaving) {
            return
        }
        this.preventSaving = true
        setTimeout(() => {
            this.preventSaving = false
        }, 10000)
        NotificationManager.showNotification(NOTIFICATION_TYPE.SUCCESS, isAutoSaving ? '자동 저장 중..' : '저장 중..', '', 3)
        await ContentAPI.updateContent(this.openedDocument, this.content)
        this.openedDocument.content = this.content
    }

    tryAutoSave () {
        if (this.existAutoSavingTimeout) {
            return
        }
        this.existAutoSavingTimeout = true
        setTimeout(async () => {
            await this.saveContent(true)
            this.existAutoSavingTimeout = false
        }, 60000)
    }

    async handleOnChange (editor: Editor) {
        this.tryAutoSave()
    }
}
export default new ContentManager()
