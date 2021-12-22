import React from 'react'
import { makeAutoObservable, toJS } from 'mobx'
import Document from '../domain/Document'
import EventManager, { Event, OpenDocumentParam } from './EventManager'
import Router from 'next/router'
import ContentManager from './ContentManager'
import { Editor } from 'slate'

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
    directoryDrawerWidth: number = 240
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

    private _dragOverCount = 0

    openedDocument: Document = null

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventLinstener(
            Event.OpenDocument,
            (param: OpenDocumentParam) => this.handleOpenDocument(param.document), 10)
    }

    handleOpenDocument (document: Document) {
        document.directoryInfo.isOpen = true
        this.openedDocument = document
    }

    async createNewDocument () {
        const parent = this._selectedDocument || null
        const order = this._selectedDocument ? this._selectedDocument.directoryInfo.children.length : this.documents.length
        const document = await Document.create(parent, order)
        this.selectedDocument = document
        this.openContextMenu = false
        document.directoryInfo.isChangingName = true
        Router.push('http://localhost:3000?id=' + document.meta.id)
        await ContentManager.tryOpenDocumentByDocumentId(document.meta.id)
    }

    changeDocumentName () {
        this._selectedDocument.directoryInfo.isChangingName = true
        this.selectedDocument = null
        this.openContextMenu = false
    }

    async deleteDocument () {
        await this._selectedDocument.delete()
        this.selectedDocument = null
        this.openContextMenu = false
    }

    setAvailControlOptionsByDocument (document: Document | null) {
        this.selectedDocument = document
        this._availControlOptions = []
        this._availControlOptions.push({ name: document ? '하위 문서 생성' : '문서 생성', callback: () => this.createNewDocument() })
        if (document) {
            this._availControlOptions.push({ name: '이름 변경', callback: () => this.changeDocumentName() })
            this._availControlOptions.push({ name: '문서 삭제', callback: () => this.deleteDocument() })
        }
    }

    handleRightClick (event: React.MouseEvent<HTMLElement, MouseEvent>, document: Document | null) {
        event.preventDefault()
        event.stopPropagation()
        this.setAvailControlOptionsByDocument(document)
        this._clickPosition = { x: event.clientX, y: event.clientY }
        this.openContextMenu = true
    }
}
export default new FileSystemManager()
