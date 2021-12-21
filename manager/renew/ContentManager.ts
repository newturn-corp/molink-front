import { makeAutoObservable, toJS } from 'mobx'
import Router from 'next/router'
import DocumentAPI from '../../api/renew/DocumentAPI'
import { DocumentNotExists } from '../../Errors/DocumentError'
import { Editor } from 'slate'
import DialogManager from '../DialogManager'
import DocumentAuthority from '../../domain/DocumentAuthority'
import UserManager from '../UserManager'
import EventManager, { ChangeDocumentTitleInFileSystemParam, Event, OpenDocumentParam } from '../home/EventManager'
import FileSystemManager from './FileSystemManager'
import Document, { DocumentVisibility } from '../../domain/renew/Document'
import { DocumentInitialInfoDTO } from '../../DTO/DocumentDto'
import DocumentManager from './DocumentManager'
import { MoveToInboxSharp } from '@material-ui/icons'

class ContentManager {
    editor: Editor = null

    openedDocument: Document = null

    title: string
    authority: DocumentAuthority = null
    visibility: DocumentVisibility = DocumentVisibility.Private
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
                return DialogManager.openDialog('문서에 접근할 수 없습니다.', '이전 화면으로 돌아갑니다.', () => {
                    if (UserManager.isUserAuthorized) {
                        Router.push('/')
                    } else {
                        Router.push('/signin')
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
                        Router.push('/')
                    } else {
                        Router.push('/signin')
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
