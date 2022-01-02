import { makeAutoObservable, toJS } from 'mobx'
import DocumentAPI from '../api/DocumentAPI'
import { DocumentNotExists } from '../Errors/DocumentError'
import { Editor, Location, Transforms } from 'slate'
import DialogManager from './DialogManager'
import UserManager from './UserManager'
import EventManager, { ChangeDocumentTitleInFileSystemParam, DeleteDocumentParam, Event, OpenDocumentParam } from './EventManager'
import Document from '../domain/Document'
import DocumentManager from './DocumentManager'
import RoutingManager, { Page } from './RoutingManager'

class ContentManager {
    editor: Editor = null

    currentContentUserId: number | null = null
    openedDocument: Document = null

    isLoadingContent: boolean = false

    constructor () {
        makeAutoObservable(this, {
            editor: false
        })
        EventManager.addEventLinstener(
            Event.ChangeDocumentTitleInFileSystem,
            (param: ChangeDocumentTitleInFileSystemParam) => {
                this.handleRenameDocumentTitle(param.document, param.title)
            }, 1
        )
        EventManager.addEventLinstener(
            Event.DeleteDocument,
            async (param: DeleteDocumentParam) => {
                await this.handleDeleteDocument(param.document)
            }, 1
        )
        EventManager.addEventLinstener(
            Event.MoveToAnotherPage,
            async () => {
                if (this.openedDocument) {
                    await this.exitDocument()
                }
            }, 100
        )
    }

    async exitDocument () {
        this.openedDocument.directoryInfo.isOpen = false
        this.openedDocument = null
        const deleteCount = this.editor.children.length
        for (let i = 0; i < deleteCount; i++) {
            const node = this.editor.children[i]
            this.editor.apply({ type: 'remove_node', path: [0], node })
        }
    }

    async handleDeleteDocument (document: Document) {
        if (!this.openedDocument) {
            return
        }
        if (this.openedDocument.equal(document) || this.openedDocument.isChildOf(document)) {
            await this.exitDocument()
            RoutingManager.moveTo(Page.Index)
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
                await DialogManager.openDialog('문서에 접근할 수 없습니다.', '이전 화면으로 돌아갑니다.', ['이전'])
                if (UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.Index)
                } else {
                    RoutingManager.moveTo(Page.SignIn)
                }
            }
            if (this.openedDocument) {
                // 이미 열려있던 문서가 있는 경우
                await this.exitDocument()
            }
            // 만약 기존의 ContentUserId랑 지금의 userId가 다른 경우
            if (this.currentContentUserId !== dto.userId) {
                await DocumentManager.init(dto.userId)
                this.currentContentUserId = dto.userId
            }
            const document = DocumentManager.documentMap.get(documentId)

            document.directoryInfo.isOpen = true
            document.authority = dto.authority
            document.meta.visibility = dto.visibility
            document.content = dto.content
            document.contentId = dto.contentId

            this.openedDocument = document
            const rawDocument = toJS(this.openedDocument)
            for (let i = 0; i < this.openedDocument.content.length; i++) {
                this.editor.apply({ type: 'insert_node', path: [i], node: rawDocument.content[i] })
            }
        } catch (err) {
            if (err instanceof DocumentNotExists) {
                await DialogManager.openDialog('문서가 존재하지 않습니다.', '이전 화면으로 돌아갑니다.', ['이전'])
                if (UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.Index)
                } else {
                    RoutingManager.moveTo(Page.SignIn)
                }
            } else {
                throw err
            }
        } finally {
            this.isLoadingContent = false
            EventManager.issueEvent(Event.LoadingContent, { editor: this.editor })
        }
    }

    updateTitle (title: string) {
        if (!this.openedDocument || this.openedDocument.meta.title === title || this.openedDocument.directoryInfo.isChangingName) {
            return
        }
        this.openedDocument.meta.title = title
        // EventManager.issueEvent(Event.ChangeDocumentTitleInEditor, { title })
    }

    select (target: Location) {
        Transforms.select(this.editor, target)
    }
}
export default new ContentManager()
