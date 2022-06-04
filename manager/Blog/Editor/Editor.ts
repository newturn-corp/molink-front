import { makeAutoObservable, observable } from 'mobx'
import { BasePoint, BaseRange, createEditor, Editor as SlateEditor, Element, Transforms } from 'slate'
import EventManager from '../../global/Event/EventManager'
import * as Y from 'yjs'
import { Event } from '../../global/Event/Event'
import { EditorTagList } from './EditorTagList'
import { EditorInfo } from './EditorInfo'
import { EditorPermanenceManager } from './EditorPermanenceManager'
import ViewerAPI from '../../../api/ViewerAPI'
import { EditorSelection } from './EditorSelection'
import UserManager from '../../global/User/UserManager'
import { ReactEditor } from 'slate-react'
import { TextCategory } from '../../../Types/slate/CustomElement'
import { EditorSynchronizer } from './EditorSynchronizer'
import { EditorViewer } from './EditorViewer'
import React from 'react'
import { EditorToolbar } from './EditorToolbar'
import { YjsEditor } from 'slate-yjs'

export class Editor {
    public editable: boolean = false
    public showPlaceholder: boolean = true
    public pageId: string = null
    yjsDocument: Y.Doc = null
    slateEditor: SlateEditor = null

    title: string = ''
    info: EditorInfo = null
    selection: EditorSelection = null
    tagList: EditorTagList = null
    permanenceManager: EditorPermanenceManager = null

    viewer: EditorViewer = null
    synchronizer: EditorSynchronizer = null

    toolbar: EditorToolbar

    editableElement: HTMLElement = null
    contentBody: HTMLElement = null
    titleRef: React.MutableRefObject<HTMLDivElement> = null

    lastPressedKey: string = null
    lastSelection: any
    isLoaded: boolean = false

    constructor (title: string) {
        this.title = title

        this.yjsDocument = new Y.Doc()
        this.info = new EditorInfo(this.yjsDocument.getMap('info'))
        this.selection = new EditorSelection(this.yjsDocument.getMap('selection'))
        this.tagList = new EditorTagList(this.yjsDocument.getArray('tags'))
        this.toolbar = new EditorToolbar()

        makeAutoObservable(this, {
            slateEditor: observable.ref,
            yjsDocument: false,
            titleRef: false,
            synchronizer: false,
            viewer: false,
            selection: false
        })
        EventManager.addEventListeners(
            [Event.UnloadPage,
                Event.MoveToAnotherPage
            ], () => {
                this.reset()
            }, 1
        )
    }

    async load (pageId: string) {
        this.pageId = pageId
        this.editable = UserManager.isUserAuthorized && (await ViewerAPI.getDocumentAuthority(pageId)).editable

        if (!this.editable) {
            this.viewer = new EditorViewer(pageId)
            await this.viewer.load()
            this.slateEditor = this.viewer.getSlateEditor()
        } else {
            this.synchronizer = new EditorSynchronizer(this.pageId, this.yjsDocument)
            await this.synchronizer.connect()
            this.slateEditor = this.synchronizer.getSlateEditor()
            this.permanenceManager = new EditorPermanenceManager(this.pageId, this.tagList, this.slateEditor)
        }
        this.isLoaded = true
        this.toolbar.isOpen = this.editable
        await EventManager.issueEvent(Event.LoadContent)
    }

    reset () {
        if (this.synchronizer) {
            this.synchronizer.reset()
        }
        this.synchronizer = null
        if (this.viewer) {
            this.viewer.reset()
        }
        this.viewer = null
        if (this.info) {
            this.info.reset()
        }
        this.info = null

        this.pageId = null
        this.isLoaded = false

        this.editable = false
        this.showPlaceholder = true

        this.yjsDocument = null
        this.slateEditor = null

        this.tagList = null

        this.viewer = null
        this.toolbar = null
        this.permanenceManager = null
        this.lastPressedKey = null
    }

    handleContentFooterClicked () {
        if (this.editable && !this.info.isLocked) {
            ReactEditor.focus(this.slateEditor as ReactEditor)
            Transforms.insertNodes(this.slateEditor, {
                type: 'text',
                category: TextCategory.Content3,
                children: [{ text: '' }]
            }, {
                at: [this.slateEditor.children.length]
            })
            Transforms.select(this.slateEditor, [this.slateEditor.children.length - 1])
        }
    }

    insertElement (element: Element, insertPosition: BasePoint | number[]) {
        const lineBefore = SlateEditor.before(this.slateEditor, insertPosition, { unit: 'word' })
        const beforeRange = lineBefore && SlateEditor.range(this.slateEditor, lineBefore, insertPosition)
        const beforeText = beforeRange && SlateEditor.string(this.slateEditor, beforeRange)
        if (beforeText && beforeText.length > 0) {
            Transforms.insertNodes(this.slateEditor, element)
        } else {
            Transforms.setNodes<Element>(this.slateEditor, element, {
                match: n => SlateEditor.isBlock(this.slateEditor, n)
            })
        }
    }
}
