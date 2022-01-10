import { makeAutoObservable } from 'mobx'
import ContentAPI from '../api/ContentAPI'
import DocumentAPI from '../api/DocumentAPI'
import { UpdateContentDTO } from '../DTO/ContentDTO'
import { SetDocumentTitleDTO, UpdateDocumentSelectionDTO } from '../DTO/DocumentDto'
import ContentManager from './ContentManager'
import EventManager, { Event } from './EventManager'

export enum ContentSaveStatus {
    Saved,
    Saving,
    SaveFailed
}

class SaveManager {
    existAutoSavingTimeout: boolean = false
    preventSaving: boolean = false
    contentSaveStatus: ContentSaveStatus = ContentSaveStatus.Saved
    isSaving: boolean = false
    lastSavedAt: Date = new Date()

    constructor () {
        makeAutoObservable(this)

        // 페이지에서 나갈 때 자동 저장
        EventManager.addEventLinstener(Event.UnloadPage, async () => {
            if (ContentManager.openedDocument && ContentManager.openedDocument.authority.editable) {
                await this.saveContent(true, false)
            }
        }, 1)

        // 다른 페이지로 이동할 때 자동 저장
        // TODO: 컨텐츠에 변화가 없다면 저장 않도록 하기
        EventManager.addEventLinstener(Event.MoveToAnotherPage, async () => {
            if (ContentManager.openedDocument && ContentManager.openedDocument.authority.editable) {
                await this.saveContent(true, false)
            }
        }, 1)

        // 에디터가 바뀔 때마다 변경 시도
        EventManager.addEventLinstener(Event.EditorChange, async () => {
            if (ContentManager.openedDocument && ContentManager.openedDocument.authority.editable) {
                await this.saveContent()
            }
        }, 100)
    }

    async saveContent (force: boolean = false, isAutoSaving: boolean = false) {
        // if (!force && this.preventSaving) {
        //     return
        // }
        // const targetDocument = ContentManager.openedDocument
        // if (!targetDocument) {
        //     return
        // }
        // this.preventSaving = true
        // setTimeout(() => {
        //     this.preventSaving = false
        // }, 10000)

        // this.contentSaveStatus = ContentSaveStatus.Saving
        // this.isSaving = true
        // try {
        //     await ContentAPI.updateContent(new UpdateContentDTO(targetDocument.contentId, targetDocument.content))
        //     await DocumentAPI.updateDocumentSelection(new UpdateDocumentSelectionDTO(targetDocument.meta.id, ContentManager.editor.selection.focus))
        //     await DocumentAPI.setDocumentTitle(new SetDocumentTitleDTO(targetDocument.meta.id, targetDocument.meta.title))
        //     this.contentSaveStatus = ContentSaveStatus.Saved
        //     this.lastSavedAt = new Date()
        // } catch (err) {
        //     this.contentSaveStatus = ContentSaveStatus.SaveFailed
        // }
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
export default new SaveManager()
