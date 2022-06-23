import React from 'react'
import { makeAutoObservable } from 'mobx'
import Blog from '../Blog'
import EventManager from '../../Event/EventManager'
import { Event } from '../../Event/Event'
import { InputRef } from 'antd'
import * as Y from 'yjs'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'

export class BlogPageTitleEditor {
    isEditing: boolean = false
    public pageMap: Y.Map<HierarchyDocumentInfoInterface>
    pageID: string = null
    pageRef: React.MutableRefObject<HTMLDivElement> = null
    editorRef: React.MutableRefObject<HTMLDivElement> = null
    inputRef: React.MutableRefObject<HTMLInputElement> = null
    title: string = null

    constructor (pageMap: Y.Map<HierarchyDocumentInfoInterface>) {
        this.pageMap = pageMap
        makeAutoObservable(this, {
            editorRef: false,
            inputRef: false,
            pageRef: false,
            pageMap: false
        })
    }

    startTitleEditing (pageID: string, pageRef: React.MutableRefObject<HTMLDivElement>) {
        const page = Blog.pageHierarchy.map[pageID]
        this.title = page.title
        this.pageID = pageID
        this.pageRef = pageRef
        const rect = pageRef.current.getBoundingClientRect()
        const position = {
            top: rect.top + (rect.height / 2),
            left: rect.left + (rect.width / 2)
        }
        const editorElement = this.editorRef.current
        setTimeout(() => {
            if (globalThis.document.body.clientHeight < position.top + editorElement.offsetHeight + 100) {
                editorElement.style.top = `${position.top - editorElement.offsetHeight - 5}px`
            } else {
                editorElement.style.top = `${position.top + 5}px`
            }
            if (global.document.body.clientWidth < position.left + editorElement.offsetWidth + 100) {
                editorElement.style.left = `${position.left - editorElement.offsetWidth}px`
            } else {
                editorElement.style.left = `${position.left}px`
            }
            this.isEditing = true
            this.inputRef.current.focus()
        }, 0)
        EventManager.addDisposableEventListener(Event.PageBodyClick, () => {
            this.endTitleEditing()
        }, 1)
    }

    endTitleEditing () {
        if (!this.isEditing) {
            return
        }
        const page = this.pageMap.get(this.pageID)
        if (this.title !== page.title) {
            page.title = this.title
            this.pageMap.set(this.pageID, page)
        }

        this.isEditing = false
        const editorElement = this.editorRef.current
        editorElement.style.top = '-9999px'
        editorElement.style.left = '-9999px'
        this.pageRef = null
        this.pageID = null
        this.title = null
    }
}
