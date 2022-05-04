import React from 'react'
import isUrl from 'is-url'
import { Editor, Element, Range, Transforms } from 'slate'
import { makeAutoObservable, toJS } from 'mobx'
import LinkMenuItem from './LinkMenuItem'
import { LinkManager } from './LinkManager'
import EditorManager from '../../Blog/EditorManager'

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
                Transforms.removeNodes(EditorManager.slateEditor, {
                    match: node => Element.isElement(node) && EditorManager.slateEditor.isInline(node) && node.type === 'link'
                })
                EditorManager.insertElement({
                    type: 'bookmark',
                    url,
                    children: [{ text: '' }]
                }, EditorManager.slateEditor.selection.focus)
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
