import React from 'react'
import { makeAutoObservable, toJS } from 'mobx'
import Document from '../../domain/renew/Document'
import DocumentManager from './DocumentManager'
import EventManager, { Event, OpenDocumentParam } from '../home/EventManager'
import DocumentDirectoryInfo from '../../domain/renew/DocumentDirectoryInfo'
import Router from 'next/router'
import ContentManager from './ContentManager'

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
        EventManager.deleteDocumentListener.push((document: Document) => this.deleteDocument(document))
        EventManager.addEventLinstener(
            Event.OpenDocument,
            (param: OpenDocumentParam) => this.handleOpenDocument(param.document), 10)
    }

    handleOpenDocument (document: Document) {
        document.directoryInfo.isOpen = true
        this.openedDocument = document
        Router.push('?id=' + document.meta.id)
    }

    async createNewDocument () {
        const parent = this.selectedDocument || null
        const order = this.selectedDocument ? this.selectedDocument.directoryInfo.children.length : this.documents.length
        const document = await Document.create(parent, order)
        this.selectedDocument = document
        this.openContextMenu = false
        document.directoryInfo.isChangingName = true
        await ContentManager.tryOpenDocumentByDocumentId(document.meta.id)
    }

    changeDocumentName () {
        this._selectedDocument.directoryInfo.isChangingName = true
        this.openContextMenu = false
    }

    deleteDocument (document: Document) {
        document.delete()
        this.openContextMenu = false
    }

    setAvailControlOptionsByDocument (document: Document | null) {
        this.selectedDocument = document
        this._availControlOptions = []
        this._availControlOptions.push({ name: document ? '하위 문서 생성' : '문서 생성', callback: () => this.createNewDocument() })
        if (document) {
            this._availControlOptions.push({ name: '이름 변경', callback: () => this.changeDocumentName() })
            this._availControlOptions.push({ name: '문서 삭제', callback: () => EventManager.issueDeleteDocumentEvent(this.selectedDocument) })
        }
    }

    handleRightClick (event: React.MouseEvent<HTMLElement, MouseEvent>, document: Document | null) {
        event.preventDefault()
        event.stopPropagation()
        this.setAvailControlOptionsByDocument(document)
        this._clickPosition = { x: event.clientX, y: event.clientY }
        this.openContextMenu = true
    }

    handleDragOver (document: Document, dragLocation: DragLocation) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.meta.id === document.meta.id) {
            return
        }
        if (dragLocation === DragLocation.Top) {
            this.selectedDocument = null
            document.directoryInfo.tryingGetOlderSibling = true
            document.directoryInfo.tryingGetYoungerSibling = false
            this._dragOverCount = 0
        } else if (dragLocation === DragLocation.Bottom) {
            this.selectedDocument = null
            document.directoryInfo.tryingGetYoungerSibling = true
            document.directoryInfo.tryingGetOlderSibling = false
            this._dragOverCount = 0
        } else {
            document.directoryInfo.tryingGetOlderSibling = false
            document.directoryInfo.tryingGetYoungerSibling = false
            this.selectedDocument = document
            this._dragOverCount += 1
            if (this._dragOverCount > 30) {
                document.directoryInfo.isChildrenOpen = true
                this._dragOverCount = 0
                this.selectedDocument = null
            }
        }
    }

    handleDragLeave (document: Document) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.meta.id === document.meta.id) {
            return
        }
        this._dragOverCount = 0
        document.directoryInfo.tryingGetOlderSibling = false
        document.directoryInfo.tryingGetYoungerSibling = false
    }

    async handleDrop (document: Document) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.meta.id === document.meta.id) {
            return
        }

        let newOrder
        // order 갱신
        if (document.directoryInfo.tryingGetOlderSibling) {
            newOrder = document.directoryInfo.order
        } else if (document.directoryInfo.tryingGetYoungerSibling) {
            newOrder = document.directoryInfo.order + 1
        } else {
            newOrder = 0
        }

        const newParent = !(document.directoryInfo.tryingGetOlderSibling || document.directoryInfo.tryingGetYoungerSibling) ? document : document.directoryInfo.parent

        await this.draggingDocument.directoryInfo.setDocumentLocation(newParent, newOrder)

        this.draggingDocument = null
        this.selectedDocument = null
        this._dragOverCount = 0
        document.directoryInfo.tryingGetOlderSibling = false
        document.directoryInfo.tryingGetYoungerSibling = false
    }

    handleDragStart (document: Document) {
        this.draggingDocument = document
    }
}
export default new FileSystemManager()
