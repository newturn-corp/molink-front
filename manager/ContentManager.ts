import { action, computed, makeAutoObservable, observable, runInAction, toJS } from 'mobx'
import { Editor } from 'slate'
import ContentAPI from '../api/ContentAPI'
import Document from '../domain/Document'
import NotificationManager, { NOTIFICATION_TYPE } from './NotificationManager'

class ContentManager {
    editor: Editor = null

    openedDocument: Document = null

    existAutoSavingTimeout: boolean = false
    preventSaving: boolean = false

    constructor () {
        makeAutoObservable(this, { editor: false, existAutoSavingTimeout: false, preventSaving: false })
    }

    renameDocumentTitle (title: string) {
        this.openedDocument.title = title
    }

    async openDocument (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            return
        }
        if (this.openedDocument) {
            // 이미 열려있던 문서가 있는 경우 초기화
            this.openedDocument = null
            const deleteCount = this.editor.children.length
            for (let i = 0; i < deleteCount; i++) {
                const node = this.editor.children[i]
                this.editor.apply({ type: 'remove_node', path: [0], node })
            }
        }

        if (!document.content) {
            document.content = await ContentAPI.getContentByDocument(document)
        }

        this.openedDocument = document
        for (let i = 0; i < this.openedDocument.content.length; i++) {
            this.editor.apply({ type: 'insert_node', path: [i], node: toJS(this.openedDocument).content[i] })
        }
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
        await ContentAPI.updateContent(this.openedDocument, this.openedDocument.content)
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
