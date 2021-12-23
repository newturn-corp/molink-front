import React from 'react'
import { Editor } from 'slate'
import Document, { DocumentVisibility } from '../domain/Document'
import GlobalManager from './GlobalManager'

export enum Event {
    EditorOnKeyDown,
    DocumentChildrenOpen,
    UserProfileInited,
    OpenDocument,
    ChangeDocumentTitleInEditor,
    UserAuthorization,
    ChangeDocumentTitleInFileSystem,
    DelteDocument,
    DocumentMapInited,
    InitGlobalVariable,
    MoveToSignInPage,
    MoveToAnotherPage
}

type EventListener = (param: EventParam) => void

export type EventParam = OnEditorKeyDownParam | DocumentChildrenOpenParam | UserProfileInitedParam | OpenDocumentParam | ChangeDocumentTitleInEditorParam | UserAuthorizationParam | ChangeDocumentTitleInFileSystemParam | DeleteDocumentParam

export type DeleteDocumentParam = {
    document: Document
}

export type ChangeDocumentTitleInFileSystemParam = {
    document: Document
    title: string
}
export type OnEditorKeyDownParam = {
    rawEvent: React.KeyboardEvent<Element>
    editor: Editor
}
export type DocumentChildrenOpenParam = {
    document: Document,
    childrenOpen: boolean
}
export type UserProfileInitedParam = {

}
export type OpenDocumentParam = {
    document: Document
}
export type ChangeDocumentTitleInEditorParam = {
    document: Document,
    title: string
}
export type UserAuthorizationParam = {
    result: boolean
}

class EventManager {
    private _eventListenerMap: Map<Event, { listener: EventListener, priority: number }[]> = new Map()

    initGlobalVariableListener: (() => void)[] = []

    beforeUnloadListener: (() => void)[] = []
    deleteDocumentListener: ((document: Document) => void)[] = []
    openDocumentChildrenListener: ((document: Document, value: boolean) => void)[] = []
    changeDocumentIconListeners: ((document: Document, icon: string) => void)[] = []
    renameDocumentTitleListeners: ((document: Document, title: string) => void)[] = []
    changeDocumentVisibilityListeners: ((document: Document, visibility: DocumentVisibility) => void)[] = []

    constructor () {
        [
            Event.DocumentChildrenOpen,
            Event.EditorOnKeyDown,
            Event.UserProfileInited,
            Event.OpenDocument,
            Event.ChangeDocumentTitleInEditor,
            Event.UserAuthorization,
            Event.ChangeDocumentTitleInFileSystem,
            Event.DelteDocument,
            Event.DocumentMapInited,
            Event.InitGlobalVariable,
            Event.MoveToSignInPage,
            Event.MoveToAnotherPage].forEach(event => this._eventListenerMap.set(event, []))
        this.initGlobalVariableListener.push(() => this.addGlobalEventListener())
    }

    async issueEvent (event: Event, param: EventParam) {
        const listeners = this._eventListenerMap.get(event)
        for (const listener of listeners) {
            await listener.listener(param)
        }
    }

    addEventLinstener (event: Event, listener: EventListener, priority: number) {
        this._eventListenerMap.get(event).push({ listener, priority })
        this._eventListenerMap.get(event).sort((a, b) => a.priority - b.priority)
    }

    addGlobalEventListener () {
        GlobalManager.window.addEventListener('beforeunload', () => {
            this.beforeUnloadListener.forEach(listener => {
                listener()
            })
        })
    }

    issueInitGlobalVariable () {
        this.initGlobalVariableListener.forEach(listener => {
            listener()
        })
    }

    issueDeleteDocumentEvent (document: Document) {
        this.deleteDocumentListener.forEach(listener => {
            listener(document)
        })
    }

    issueOpenDocumentChildrenEvent (document: Document, value: boolean) {
        this.openDocumentChildrenListener.forEach(listener => {
            listener(document, value)
        })
    }

    issueChangeDocumentIcon (document: Document, icon: string) {
        this.changeDocumentIconListeners.forEach(listener => {
            listener(document, icon)
        })
    }

    issueRenameDocumentTitle (document: Document, title: string) {
        this.renameDocumentTitleListeners.forEach(listener => {
            listener(document, title)
        })
    }

    issueChangeDocumentVisibility (document: Document, visibility: DocumentVisibility) {
        this.changeDocumentVisibilityListeners.forEach(listener => {
            listener(document, visibility)
        })
    }
}
export default new EventManager()
