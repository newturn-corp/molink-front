import React from 'react'
import { Editor, Element, Transforms } from 'slate'
import { makeAutoObservable } from 'mobx'
import LinkMenuItem from './LinkMenuItem'
import { LinkManager } from './LinkManager'
import EditorPage from '../../Blog/Editor/EditorPage'

export class LinkMenu {
    manager: LinkManager
    index: number = 0
    menuItemList: LinkMenuItem[] = []
    isLinkMenuOpen: boolean = false

    constructor (manager: LinkManager) {
        this.manager = manager
        makeAutoObservable(this, {
            manager: false
        })
    }

    open (url: string) {
        this.menuItemList = [
            new LinkMenuItem('링크 추가', () => {
                this.close()
            }),
            new LinkMenuItem('북마크 추가', () => {
                const editor = EditorPage.editor
                const slateEditor = editor.slateEditor
                Transforms.removeNodes(slateEditor, {
                    match: node => Element.isElement(node) && slateEditor.isInline(node) && node.type === 'link'
                })
                editor.insertElement({
                    type: 'bookmark',
                    url: url,
                    title: new URL(url).hostname,
                    description: '',
                    imageURL: undefined,
                    lastLoadedAt: undefined,
                    iconURL: undefined,
                    children: [{ text: '' }]
                }, slateEditor.selection.focus)
                this.close()
            })
        ]
        this.isLinkMenuOpen = true
    }

    close () {
        this.index = 0
        this.isLinkMenuOpen = false
    }

    handleCtrlZDown (event) {
        if (!this.isLinkMenuOpen) {
            return false
        }
        this.close()
    }

    handleArrowDown (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isLinkMenuOpen) {
            return false
        }
        event.preventDefault()
        this.index = this.index >= this.menuItemList.length - 1 ? 0 : this.index + 1
        return true
    }

    handleArrowUp (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isLinkMenuOpen) {
            return false
        }
        event.preventDefault()
        this.index = this.index <= 0 ? this.menuItemList.length - 1 : this.index - 1
        return true
    }

    handleEnterAndTab (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isLinkMenuOpen) {
            return false
        }
        event.preventDefault()
        this.menuItemList[this.index].onClick()
        return true
    }

    handleEscape (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isLinkMenuOpen) {
            return false
        }
        event.preventDefault()
        return true
    }
}
