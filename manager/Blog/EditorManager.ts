import { makeAutoObservable, observable } from 'mobx'
import { BasePoint, BaseRange, createEditor, Editor, Editor as SlateEditor, Element, Transforms } from 'slate'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { SyncElement, withYjs } from 'slate-yjs'
import randomColor from 'randomcolor'
import { withHistory } from 'slate-history'
import { ReactEditor, withReact } from 'slate-react'
import { EditorPlugin } from '../../plugin'
import ViewerAPI from '../../api/ViewerAPI'
import { DocumentNotExists } from '../../Errors/DocumentError'
import { withCursor } from '../../plugin/EditorPlugins/CursorPlugin'
import { Awareness } from 'y-protocols/awareness'
import { Cursor } from 'slate-yjs/dist/main/model'
import { relativePositionToAbsolutePosition } from '../../utils/relativePositionToAbsolutePosition'
import { Event } from '../global/Event/Event'
import UserManager from '../global/User/UserManager'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import EventManager from '../global/Event/EventManager'
import { throttle } from 'lodash'
import React from 'react'
import { SlateImageElementType, TextCategory } from '../../Types/slate/CustomElement'
import ContentAPI from '../../api/ContentAPI'
import { UpdatePageDataInSearchEngineDTO } from '@newturn-develop/types-molink/dist/DTO'
import Serializer from './Editor/Serializer'
import { PageVisibility } from '@newturn-develop/types-molink'

class EditorManager {
    public editable: boolean = false
    public showPlaceholder: boolean = true
    public pageId: string = null
    yjsDocument: Y.Doc = null
    slateEditor: SlateEditor = null
    sharedType: Y.Array<SyncElement> = null

    yInfo: Y.Map<any> = null
    info: any

    ySelection: Y.Map<any> = null
    selectionMap: any

    websocketProvider: WebsocketProvider = null
    awareness: Awareness
    isConnected: boolean = false
    cursors: Cursor[] = []
    editableElement: HTMLElement = null
    contentBody: HTMLElement = null
    titleRef: React.MutableRefObject<HTMLDivElement> = null

    isLocked: boolean = false
    isToolbarOpen: boolean = true
    lastPressedKey: string = null
    lastSelection: BaseRange = null
    shouldUpdateLastEditedAt: boolean = false

    constructor () {
        makeAutoObservable(this, {
            slateEditor: observable.ref,
            yjsDocument: false,
            sharedType: false,
            yInfo: false,
            websocketProvider: false,
            titleRef: false,
            lastSelection: false
        })
        EventManager.addEventListeners(
            [Event.UnloadPage,
                Event.MoveToAnotherPage,
                Event.SignOut
            ], () => {
                this._saveCurrentSelection()
                this.updatePageDataInSearchEngine()
                this.reset()
            }, 1)
    }

    async load (pageId: string) {
        this.yjsDocument = new Y.Doc()
        this.sharedType = this.yjsDocument.getArray<SyncElement>('content')
        this.yInfo = this.yjsDocument.getMap('info')
        this.yInfo.observeDeep(() => {
            this.info = this.yInfo.toJSON()
            const isLocked = this.yInfo.get('isLocked')
            if (this.isLocked !== isLocked) {
                this.isLocked = isLocked
                EventManager.issueEvent(Event.LockPage, { isLocked })
            }
        })

        this.ySelection = this.yjsDocument.getMap('selection')
        this.ySelection.observeDeep(() => {
            this.selectionMap = this.ySelection.toJSON()
        })

        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        if (!currentHierarchy) {
            throw new DocumentNotExists()
        }
        const page = currentHierarchy.map[pageId]
        if (!page) {
            throw new DocumentNotExists()
        }
        this.editable = UserManager.isUserAuthorized && currentHierarchy.editable && !!page
        this.lastPressedKey = null

        if (!this.editable) {
            const dto = await ViewerAPI.getContent(pageId)
            Y.applyUpdate(this.yjsDocument, Uint8Array.from(dto.content))
            this.slateEditor = EditorPlugin(
                withYjs(withReact(withHistory(createEditor())), this.sharedType))
            this.isToolbarOpen = false
        } else {
            this.websocketProvider = new WebsocketProvider(process.env.CONTENT_SERVER_URL, pageId, this.yjsDocument, {
                connect: false
            })
            const color = randomColor({
                luminosity: 'dark',
                format: 'rgba',
                alpha: 1
            })

            this.websocketProvider.on('status', ({ status }: { status: string }) => {
                this.isConnected = status === 'connected'
            })

            this.websocketProvider.on('sync', () => {
                if (!this.selectionMap) {
                    return
                }
                if (this.selectionMap) {
                    const userSelection = this.selectionMap[UserManager.userId.toString()]
                    if (!userSelection) {
                        return
                    }
                    ReactEditor.focus(this.slateEditor)
                    Transforms.select(this.slateEditor, userSelection)
                }
            })

            this.awareness = this.websocketProvider.awareness

            this.awareness.setLocalState({
                alphaColor: color.slice(0, -2) + '0.2)',
                color,
                name: UserManager.profile.nickname
            })

            this.awareness.on('update', throttle(() => {
                if (!this.sharedType) {
                    return
                }
                const newCursorData = Array.from(this.awareness.getStates())
                    .filter(([clientId]) => clientId !== this.sharedType.doc?.clientID)
                    .map(([, awareness]) => {
                        let anchor = null
                        let focus = null

                        if (awareness.anchor) {
                            anchor = relativePositionToAbsolutePosition(
                                this.sharedType,
                                awareness.anchor
                            )
                        }

                        if (awareness.focus) {
                            focus = relativePositionToAbsolutePosition(
                                this.sharedType,
                                awareness.focus
                            )
                        }

                        return {
                            anchor,
                            focus,
                            data: awareness
                        }
                    })
                    .filter((cursor) => cursor.anchor && cursor.focus)
                this.cursors = newCursorData
            }, 300))

            this.websocketProvider.connect()
            this.slateEditor = EditorPlugin(
                withCursor(
                    withYjs(
                        withReact(withHistory(createEditor())),
                        this.sharedType
                    ),
                    this.awareness
                ))
        }
        this.pageId = pageId
        currentHierarchy.openedPageId = pageId
        await EventManager.issueEvent(Event.LoadContent)
    }

    private _saveCurrentSelection () {
        if (this.ySelection && UserManager.isUserAuthorized && this.editable) {
            this.ySelection.set(UserManager.userId.toString(), this.slateEditor.selection)
        }
    }

    reset () {
        if (this.websocketProvider) {
            this.websocketProvider.destroy()
        }
        this.pageId = null
        this.editable = false
        this.showPlaceholder = true

        this.yjsDocument = null
        this.slateEditor = null
        this.sharedType = null
        this.yInfo = null
        this.info = null

        this.ySelection = null
        this.selectionMap = null

        this.websocketProvider = null
        this.isConnected = false
        this.isLocked = false
        this.shouldUpdateLastEditedAt = false
    }

    updateIsLocked (isLocked: boolean) {
        this.yInfo.set('isLocked', isLocked)
    }

    async updateIsToolbarOpen (isOpen: boolean) {
        this.isToolbarOpen = isOpen
        await EventManager.issueEvent(Event.ToolbarOnOffChange, { isToolbarOpen: isOpen })
    }

    setTitleFocus () {
        this.titleRef.current.focus()
    }

    handleContentFooterClicked () {
        ReactEditor.focus(this.slateEditor)
        Transforms.insertNodes(this.slateEditor, {
            type: 'text',
            category: TextCategory.Content3,
            children: [{ text: '' }]
        }, {
            at: [this.slateEditor.children.length]
        })
        Transforms.select(this.slateEditor, [this.slateEditor.children.length - 1])
    }

    insertElement (element: Element, insertPosition: BasePoint | number[]) {
        const lineBefore = Editor.before(this.slateEditor, insertPosition, { unit: 'word' })
        const beforeRange = lineBefore && Editor.range(this.slateEditor, lineBefore, insertPosition)
        const beforeText = beforeRange && Editor.string(this.slateEditor, beforeRange)
        if (beforeText && beforeText.length > 0) {
            Transforms.insertNodes(this.slateEditor, element)
        } else {
            Transforms.setNodes<Element>(this.slateEditor, element, {
                match: n => Editor.isBlock(this.slateEditor, n)
            })
        }
    }

    async updatePageDataInSearchEngine () {
        if (!this.pageId || !UserManager.isUserAuthorized || !this.editable) {
            return
        }
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        const page = currentHierarchy.map[this.pageId]
        if (!page) {
            return
        }
        const image = this.slateEditor.children.filter(child => Element.isElement(child) && child.type === 'image')[0] as SlateImageElementType
        const { result: content, description } = Serializer.serializePlainText(this.slateEditor.children)
        await ContentAPI.updatePageDataInSearchEngine(new UpdatePageDataInSearchEngineDTO(
            this.pageId,
            page.title,
            content,
            description,
            this.pageVisibilityToNumber(page.visibility),
            this.shouldUpdateLastEditedAt ? Number(new Date()) : undefined,
            image ? `${image.url}?pageId=${this.pageId}` : undefined))
    }

    pageVisibilityToNumber (visibility: PageVisibility) {
        switch (visibility) {
        case PageVisibility.Private: return 0
        case PageVisibility.OnlyFollower: return 1
        case PageVisibility.Public: return 2
        }
    }

    handleEditorOnChange () {
        if (!this.shouldUpdateLastEditedAt) {
            if (this.slateEditor.operations.filter(operation => operation.type !== 'set_selection').length > 0) {
                this.shouldUpdateLastEditedAt = true
            }
        }
    }
}
export default new EditorManager()
