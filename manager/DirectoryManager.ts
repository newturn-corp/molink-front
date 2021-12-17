import React from 'react'
import { makeAutoObservable, runInAction, toJS } from 'mobx'
import Document from '../domain/Document'
import DocumentManager from './DocumentManager'
import DocumentAPI from '../api/DocumentAPI'
import ContentManager from './ContentManager'

export enum DirectoryObjectType {
    Drawer,
    Folder,
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

class DirectoryManager {
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
            this._selectedDocument.isSelected = false
        }
        this._selectedDocument = document
        if (document) {
            this._selectedDocument.isSelected = true
        }
    }

    public draggingDocument: Document = null

    private _dragOverCount = 0

    constructor () {
        makeAutoObservable(this)
    }

    async createNewDocument () {
        if (!this._selectedDocument) {
            const newDocument = new Document(null, null, '', '📄', DocumentManager.documents.length, [], false, true, true)
            DocumentManager.documents.push(newDocument)
            this.selectedDocument = newDocument
            await DocumentManager.createDocument(newDocument)
            newDocument.content = [{
                type: 'paragraph',
                children: [{ text: '' }]
            }]
            ContentManager.openDocument(newDocument)
        } else {
            console.log(this._selectedDocument)
            const newDocument = new Document(null, this._selectedDocument, '', '📄', this._selectedDocument.children.length, [], false, true, true)
            this._selectedDocument.children.push(newDocument)
            this._selectedDocument.isOpen = true
            this.selectedDocument = newDocument
            await DocumentManager.createDocument(newDocument)
            newDocument.content = [{
                type: 'paragraph',
                children: [{ text: '' }]
            }]
            ContentManager.openDocument(newDocument)
        }
        this.openContextMenu = false
    }

    changeDocumentName () {
        this._selectedDocument.isChangingName = true
        this.openContextMenu = false
    }

    async setDocumentIsOpen (document: Document, isOpen: boolean) {
        document.isOpen = isOpen
        await DocumentAPI.setDocumentIsOpen(document)
    }

    deleteDocument () {
        const sibling = this._selectedDocument.parent ? this._selectedDocument.parent.children : DocumentManager.documents
        sibling.splice(this._selectedDocument.order, 1)
        sibling.forEach((doc, idx) => {
            doc.order = idx
        })
        DocumentManager.deleteDocument(this._selectedDocument)
        this.openContextMenu = false
    }

    setAvailControlOptionsByDocument (document: Document | null) {
        this.selectedDocument = document
        console.log(this.selectedDocument)
        this._availControlOptions = []
        this._availControlOptions.push({ name: '문서 생성', callback: () => this.createNewDocument() })
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

    handleDragOver (document: Document, dragLocation: DragLocation) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.id === document.id) {
            return
        }
        if (dragLocation === DragLocation.Top) {
            this.selectedDocument = null
            document.tryingGetOlderSibling = true
            document.tryingGetYoungerSibling = false
            this._dragOverCount = 0
        } else if (dragLocation === DragLocation.Bottom) {
            this.selectedDocument = null
            document.tryingGetYoungerSibling = true
            document.tryingGetOlderSibling = false
            this._dragOverCount = 0
        } else {
            document.tryingGetOlderSibling = false
            document.tryingGetYoungerSibling = false
            this.selectedDocument = document
            this._dragOverCount += 1
            if (this._dragOverCount > 30) {
                document.isOpen = true
                this._dragOverCount = 0
                this.selectedDocument = null
            }
        }
    }

    handleDragLeave (document: Document) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.id === document.id) {
            return
        }
        this._dragOverCount = 0
        document.tryingGetOlderSibling = false
        document.tryingGetYoungerSibling = false
    }

    async handleDrop (document: Document) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.id === document.id) {
            return
        }
        this._dragOverCount = 0
        const parentBefore = this.draggingDocument.parent
        const orderBefore = this.draggingDocument.order

        // 기존 부모에게서 삭제
        if (parentBefore === null) {
            DocumentManager.documents.splice(orderBefore, 1)
            DocumentManager.documents.filter(doc => doc.order > orderBefore).forEach(doc => { doc.order -= 1 })
        } else {
            parentBefore.children.splice(orderBefore, 1)
            parentBefore.children.filter(doc => doc.order > orderBefore).forEach(doc => { doc.order -= 1 })
        }

        // order 갱신
        if (document.tryingGetOlderSibling) {
            this.draggingDocument.order = document.order
        } else if (document.tryingGetYoungerSibling) {
            this.draggingDocument.order = document.order + 1
        } else {
            this.draggingDocument.order = 0
        }

        // 부모 갱신
        if (!(document.tryingGetOlderSibling || document.tryingGetYoungerSibling)) {
            this.draggingDocument.parent = document
        } else {
            this.draggingDocument.parent = document.parent
        }

        // 새 부모에게 추가
        if (this.draggingDocument.parent === null) {
            DocumentManager.documents.splice(this.draggingDocument.order, 0, this.draggingDocument)
            DocumentManager.documents.filter(doc => doc.order > orderBefore).forEach(doc => { doc.order -= 1 })
        } else {
            this.draggingDocument.parent.children.splice(this.draggingDocument.order, 0, this.draggingDocument)
            this.draggingDocument.parent.children.filter(doc => doc.order >= orderBefore).forEach(doc => { doc.order += 1 })
        }
        DocumentAPI.setDocumentLocation(parentBefore, orderBefore, this.draggingDocument)

        this.draggingDocument = null
        this.selectedDocument = null
        document.tryingGetOlderSibling = false
        document.tryingGetYoungerSibling = false
    }

    handleDragStart (document: Document) {
        this.draggingDocument = document
    }
}
export default new DirectoryManager()
