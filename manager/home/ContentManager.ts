import { action, computed, makeAutoObservable, observable, runInAction, toJS } from 'mobx'
import { Editor, Transforms } from 'slate'
import ContentAPI from '../../api/ContentAPI'
import DocumentAPI from '../../api/DocumentAPI'
import Document from '../../domain/Document'
import NotificationManager, { NOTIFICATION_TYPE } from '../NotificationManager'
import EventManager from './EventManager'

// 컨텐츠의 관리를 담당하는 매니저
class ContentManager {
    editor: Editor = null

    openedDocument: Document = null

    existAutoSavingTimeout: boolean = false
    preventSaving: boolean = false

    constructor () {
        makeAutoObservable(this, { editor: false, existAutoSavingTimeout: false, preventSaving: false })
        // 창 종료나 이동시 자동 저장
        EventManager.beforeUnloadListener.push(() => this.saveContent(true))
        EventManager.deleteDocumentListener.push((document) => this.handleDeleteDocument(document))
    }

    handleDeleteDocument (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            this.openedDocument = null
        }
    }

    renameDocumentTitle (title: string) {
        this.openedDocument.title = title
    }

    renameByFileSystem (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            this.editor.apply({ type: 'remove_node', path: [0], node: this.openedDocument.content[0] })
            this.editor.apply({ type: 'insert_node', path: [0], node: { type: 'title', children: [{ text: document.title }] } })
        }
    }

    async openDocument (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            return
        }
        if (this.openedDocument) {
            // 이미 열려있던 문서가 있는 경우
            await this.saveContent(true, false)
            this.openedDocument.isOpen = false
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
        this.openedDocument.isOpen = true
        for (let i = 0; i < this.openedDocument.content.length; i++) {
            this.editor.apply({ type: 'insert_node', path: [i], node: toJS(this.openedDocument).content[i] })
        }
    }

    async saveContent (force: boolean = false, isAutoSaving: boolean = false) {
        if (!force && this.preventSaving) {
            return
        }
        if (!this.openedDocument) {
            return
        }
        this.preventSaving = true
        setTimeout(() => {
            this.preventSaving = false
        }, 10000)
        // NotificationManager.showNotification(NOTIFICATION_TYPE.SUCCESS, isAutoSaving ? '자동 저장 중..' : '저장 중..', '', 3)
        await ContentAPI.updateContent(this.openedDocument, this.openedDocument.content)
        await DocumentAPI.setDocumentTitle(this.openedDocument)
    }

    tryAutoSave () {
        if (this.existAutoSavingTimeout) {
            return
        }
        this.existAutoSavingTimeout = true
        setTimeout(async () => {
            await this.saveContent(false, true)
            this.existAutoSavingTimeout = false
        }, 30000)
    }

    async handleOnChange (editor: Editor) {
        this.tryAutoSave()
    }
}
export default new ContentManager()
