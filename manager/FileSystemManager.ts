import React from 'react'
import { makeAutoObservable, toJS } from 'mobx'
import Document from '../domain/Document'
import EventManager, { Event, OpenDocumentParam } from './EventManager'
import ContentManager from './ContentManager'
import { DocumentVisibility } from '../domain/DocumentMeta'
import UserManager from './UserManager'
import RoutingManager, { Page } from './RoutingManager'
import DialogManager from './DialogManager'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import SettingAPI from '../api/SettingAPI'

export enum DirectoryObjectType {
    Drawer,
    Document,
    File
}

export enum DragLocation {
    Top,
    Middle,
    Bottom
}

export interface DirectoryControlOption {
    name: string,
    callback: () => void
}

// 전반적인 FileSystem의 변화를 담당하는 매니저
class FileSystemManager {
    documents: Document[] = null

    openContextMenu: boolean = false
    fileSystemWidth: number = 240
    private _clickPosition: { x: number, y: number } = { x: 0, y: 0 }
    get clickPosition () {
        return toJS(this._clickPosition)
    }

    private _availControlOptions: DirectoryControlOption[] = []
    get availControlOptions () {
        return toJS(this._availControlOptions)
    }

    private _selectedDocument: Document = null
    get selectedDocument () {
        return toJS(this._selectedDocument)
    }

    set selectedDocument (document: Document | null) {
        if (this._selectedDocument) {
            this._selectedDocument.directoryInfo.isSelected = false
        }
        this._selectedDocument = document
        if (document) {
            this._selectedDocument.directoryInfo.isSelected = true
        }
    }

    public draggingDocument: Document = null

    openedDocument: Document = null

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventLinstener(Event.UserProfileInited, () => {
            this.fileSystemWidth = UserManager.setting.fileSystemWidth
        }, 1)
    }

    updateFileSystemWidth () {
        SettingAPI.updateFileSystemWidth(this.fileSystemWidth)
    }

    async createNewDocument () {
        const parent = this._selectedDocument || null
        const order = this._selectedDocument ? this._selectedDocument.directoryInfo.children.length : this.documents.length
        const document = await Document.create(parent, order)
        EventManager.addDisposableEventListener(Event.LoadingContent, ({ editor }: { editor: Editor }) => {
            try {
                ReactEditor.focus(editor)
                Transforms.select(editor, [0, 0])
            } catch (err) {
                console.log(err)
            }
        }, 1)
        this.selectedDocument = document
        RoutingManager.moveTo(Page.Index, `?id=${document.meta.id}`)
    }

    changeDocumentName () {
        this._selectedDocument.directoryInfo.isChangingName = true
        this.selectedDocument = null
    }

    async deleteDocument () {
        const childrenCount = this._selectedDocument.directoryInfo.children.length
        const msg = childrenCount > 0 ? `${this._selectedDocument.meta.title} 문서와 그 하위 문서 ${childrenCount}개를 모두 제거합니다.` : `${this._selectedDocument.meta.title} 문서를 제거합니다.`
        const index = await DialogManager.openDialog('문서 삭제', msg, ['확인'])
        if (index !== 0) {
            return
        }
        await this._selectedDocument.delete()
        this.selectedDocument = null
    }

    setDocumentRepresentative (representative: boolean) {
        this._selectedDocument.meta.setRepresentative(representative)
        this.selectedDocument = null
    }

    setAvailControlOptionsByDocument (document: Document | null) {
        this.selectedDocument = document
        this._availControlOptions = []
        this._availControlOptions.push({ name: document ? '하위 문서 생성' : '문서 생성', callback: () => this.createNewDocument() })
        if (document) {
            if (document.meta.representative) {
                this._availControlOptions.push({ name: '대표 문서 해제', callback: () => this.setDocumentRepresentative(false) })
            }
            if (!document.meta.representative && document.meta.visibility === DocumentVisibility.Public) {
                this._availControlOptions.push({ name: '대표 문서로 설정', callback: () => this.setDocumentRepresentative(true) })
            }
            this._availControlOptions.push({ name: '이름 변경', callback: () => this.changeDocumentName() })
            this._availControlOptions.push({ name: '문서 삭제', callback: () => this.deleteDocument() })
        }
        this._availControlOptions.push({ name: '문서 목록 설정', callback: () => RoutingManager.moveTo(Page.SettingDocumentList) })
    }

    handleRightClick (event: React.MouseEvent<HTMLElement, MouseEvent>, document: Document | null) {
        if (UserManager.userId !== ContentManager.currentContentUserId) {
            return
        }
        event.preventDefault()
        event.stopPropagation()
        this.setAvailControlOptionsByDocument(document)
        this._clickPosition = { x: event.clientX, y: event.clientY }
        this.openContextMenu = true
    }
}
export default new FileSystemManager()
