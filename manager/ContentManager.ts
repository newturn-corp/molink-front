import { makeAutoObservable, toJS } from 'mobx'
import Router from 'next/router'
import DocumentAPI from '../api/renew/DocumentAPI'
import { DocumentNotExists } from '../Errors/DocumentError'
import { Editor } from 'slate'
import DialogManager from './DialogManager'
import DocumentAuthority from '../domain/DocumentAuthority'
import UserManager from './UserManager'
import EventManager, { ChangeDocumentTitleInFileSystemParam, DeleteDocumentParam, Event, OpenDocumentParam } from './EventManager'
import Document, { DocumentVisibility } from '../domain/Document'
import { DocumentInitialInfoDTO } from '../DTO/DocumentDto'
import DocumentManager from './DocumentManager'

class ContentManager {
    editor: Editor = null

    openedDocument: Document = null
    isLoadingContent: boolean = false

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventLinstener(
            Event.OpenDocument,
            (param: OpenDocumentParam) => this.tryOpenDocumentByDocumentId(param.document.meta.id), 1)
        EventManager.addEventLinstener(
            Event.ChangeDocumentTitleInFileSystem,
            (param: ChangeDocumentTitleInFileSystemParam) => {
                this.handleRenameDocumentTitle(param.document, param.title)
            }, 1
        )
        EventManager.addEventLinstener(
            Event.DelteDocument,
            (param: DeleteDocumentParam) => {
                this.handleDeleteDocument(param.document)
            }, 1
        )
        EventManager.addEventLinstener(
            Event.MoveToAnotherPage,
            () => {
                this.openedDocument = null
            }, 1
        )
    }

    async exitDocument () {
        // await this.saveContent(true, false)
        // this.openedDocument = null
        this.openedDocument.directoryInfo.isOpen = false
        this.openedDocument = null
        const deleteCount = this.editor.children.length
        for (let i = 0; i < deleteCount; i++) {
            const node = this.editor.children[i]
            this.editor.apply({ type: 'remove_node', path: [0], node })
        }
    }

    handleDeleteDocument (document: Document) {
        if (!this.openedDocument) {
            return
        }
        if (this.openedDocument.equal(document) || this.openedDocument.isChildOf(document)) {
            Router.push('')
            this.exitDocument()
        }
    }

    handleRenameDocumentTitle (document: Document, title: string) {
        if (!this.openedDocument) {
            return
        }
        if (this.openedDocument.meta.id !== document.meta.id) {
            if (document.content) {
                document.content[0].children[0].text = title
            }
            return
        }
        this.editor.apply({ type: 'remove_node', path: [0], node: this.openedDocument.content[0] })
        this.editor.apply({ type: 'insert_node', path: [0], node: { type: 'title', children: [{ text: title }] } })
    }

    async tryOpenDocumentByDocumentId (documentId: string) {
        try {
            if (this.isLoadingContent) {
                return
            }
            if (this.openedDocument && this.openedDocument.meta.id === documentId) {
                return
            }
            this.isLoadingContent = true
            const dto = await DocumentAPI.getDocument(documentId)
            if (!dto.authority.viewable) {
                this.isLoadingContent = false
                return DialogManager.openDialog('문서에 접근할 수 없습니다.', '이전 화면으로 돌아갑니다.', () => {
                    if (UserManager.isUserAuthorized) {
                        Router.push('http://localhost:3000')
                    } else {
                        Router.push('http://localhost:3000/signin')
                    }
                })
            }
            if (this.openedDocument) {
                // 이미 열려있던 문서가 있는 경우
                await this.exitDocument()
            }
            const documentAlreadyLoaded = DocumentManager.documentMap.get(documentId)
            if (documentAlreadyLoaded) {
                this.openedDocument = documentAlreadyLoaded
            } else {
                this.openedDocument = new Document(new DocumentInitialInfoDTO(dto.id, dto.userId, dto.title, dto.icon, null, 0, false))
            }
            console.log(dto)
            this.openedDocument.authority = dto.authority
            this.openedDocument.meta.visibility = dto.visibility
            this.openedDocument.content = dto.content
            this.openedDocument.directoryInfo.isOpen = true
            this.openedDocument.contentId = dto.contentId
            for (let i = 0; i < this.openedDocument.content.length; i++) {
                this.editor.apply({ type: 'insert_node', path: [i], node: toJS(this.openedDocument).content[i] })
            }
        } catch (err) {
            if (err instanceof DocumentNotExists) {
                DialogManager.openDialog('문서가 존재하지 않습니다.', '이전 화면으로 돌아갑니다.', () => {
                    if (UserManager.isUserAuthorized) {
                        Router.push('http://localhost:3000/')
                    } else {
                        Router.push('http://localhost:3000/signin')
                    }
                })
            } else {
                throw err
            }
        } finally {
            this.isLoadingContent = false
        }
    }

    updateTitle (title: string) {
        if (this.openedDocument.meta.title === title) {
            return
        }
        console.log(title)
        this.openedDocument.meta.title = title
        // EventManager.issueEvent(Event.ChangeDocumentTitleInEditor, { title })
    }
}
export default new ContentManager()
