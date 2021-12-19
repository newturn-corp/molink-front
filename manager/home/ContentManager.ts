import { action, computed, makeAutoObservable, observable, runInAction, toJS } from 'mobx'
import { Editor, Transforms } from 'slate'
import ContentAPI from '../../api/ContentAPI'
import DocumentAPI from '../../api/DocumentAPI'
import Document from '../../domain/Document'
import NotificationManager, { NOTIFICATION_TYPE } from '../NotificationManager'
import EventManager from './EventManager'

export enum ContentSaveStatus {
    Saved,
    Saving,
    SaveFailed
}

// 컨텐츠의 관리를 담당하는 매니저
class ContentManager {
    editor: Editor = null

    openedDocument: Document = null

    existAutoSavingTimeout: boolean = false
    preventSaving: boolean = false
    contentSaveStatus: ContentSaveStatus = ContentSaveStatus.Saved
    isSaving: boolean = false
    lastSavedAt: Date = new Date()

    constructor () {
        makeAutoObservable(this, { editor: false, existAutoSavingTimeout: false, preventSaving: false })
        // 창 종료나 이동시 자동 저장
        EventManager.beforeUnloadListener.push(() => this.saveContent(true))
        EventManager.deleteDocumentListener.push((document) => this.handleDeleteDocument(document))
        EventManager.renameDocumentTitleListeners.push((document: Document, title: string) => this.handleRenameDocumentTitle(document, title))
    }

    handleDeleteDocument (document: Document) {
        if (this.openedDocument && document.id === this.openedDocument.id) {
            this.openedDocument = null
        }
    }

    handleRenameDocumentTitle (document: Document, title: string) {
        if (!this.openedDocument) {
            return
        }
        if (this.openedDocument.id !== document.id) {
            if (document.content) {
                document.content[0].children[0].text = title
            }
            return
        }
        this.editor.apply({ type: 'remove_node', path: [0], node: this.openedDocument.content[0] })
        this.editor.apply({ type: 'insert_node', path: [0], node: { type: 'title', children: [{ text: title }] } })
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
        this.contentSaveStatus = ContentSaveStatus.Saving
        this.isSaving = true
        try {
            await ContentAPI.updateContent(this.openedDocument, this.openedDocument.content)
            await DocumentAPI.setDocumentTitle(this.openedDocument)
            this.contentSaveStatus = ContentSaveStatus.Saved
            this.lastSavedAt = new Date()
        } catch (err) {
            this.contentSaveStatus = ContentSaveStatus.SaveFailed
        }
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

    async handleOnChange () {
        this.tryAutoSave()
    }
}
export default new ContentManager()
