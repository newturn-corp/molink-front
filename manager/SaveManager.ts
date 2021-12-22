import { makeAutoObservable } from 'mobx'
import ContentAPI from '../api/renew/ContentAPI'
import DocumentAPI from '../api/renew/DocumentAPI'
import { UpdateContentDTO } from '../DTO/ContentDTO'
import { SetDocumentTitleDTO } from '../DTO/DocumentDto'
import ContentManager from './ContentManager'

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
    }

    async saveContent (force: boolean = false, isAutoSaving: boolean = false) {
        if (!force && this.preventSaving) {
            return
        }
        const targetDocument = ContentManager.openedDocument
        if (!targetDocument) {
            return
        }
        this.preventSaving = true
        setTimeout(() => {
            this.preventSaving = false
        }, 10000)

        this.contentSaveStatus = ContentSaveStatus.Saving
        this.isSaving = true

        try {
            await ContentAPI.updateContent(new UpdateContentDTO(targetDocument.contentId, targetDocument.content))
            await DocumentAPI.setDocumentTitle(new SetDocumentTitleDTO(targetDocument.meta.id, targetDocument.meta.title))
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
export default new SaveManager()
