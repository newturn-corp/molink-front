import { LinkManager } from '../../Editing/Link/LinkManager'
import LinkMenuItem from '../../Editing/Link/LinkMenuItem'
import { makeAutoObservable, toJS } from 'mobx'
import { Editor } from 'slate'
import React, { CSSProperties } from 'react'
import MenuItem from './MenuItem'

export type CSSPosition = {
    top?: number | undefined,
    left?: number | undefined
}

class MenuManager {
    manager: LinkManager
    index: number = 0
    _menuItemList: MenuItem[] = []
    get menuItemList () {
        return toJS(this._menuItemList)
    }

    isOpen: boolean = false
    keyboardSelectionChange = false
    menuRef: React.MutableRefObject<HTMLDivElement> = null

    constructor () {
        makeAutoObservable(this, {
            manager: false,
            menuRef: false
        })
    }

    open (menuItemList: MenuItem[], position: CSSPosition, keyboardSelectionChange: boolean = false, margin: number = 100) {
        this._menuItemList = menuItemList
        this.keyboardSelectionChange = keyboardSelectionChange
        const menuElement = this.menuRef.current
        setTimeout(() => {
            if (globalThis.document.body.clientHeight < position.top + menuElement.offsetHeight + margin) {
                menuElement.style.top = `${position.top - menuElement.offsetHeight - 5}px`
            } else {
                menuElement.style.top = `${position.top + 5}px`
            }
            if (global.document.body.clientWidth < position.left + menuElement.offsetWidth + margin) {
                menuElement.style.left = `${position.left - menuElement.offsetWidth}px`
            } else {
                menuElement.style.left = `${position.left}px`
            }
            this.isOpen = true
        }, 0)
    }

    close () {
        this.index = 0
        this._menuItemList = []
        this.isOpen = false
    }

    handleCtrlZDown (event) {
        if (!this.isOpen || !this.keyboardSelectionChange) {
            return false
        }
        this.close()
    }

    handleArrowDown (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen || !this.keyboardSelectionChange) {
            return false
        }
        event.preventDefault()
        this.index = this.index >= this._menuItemList.length - 1 ? 0 : this.index + 1
        return true
    }

    handleArrowUp (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen || !this.keyboardSelectionChange) {
            return false
        }
        event.preventDefault()
        this.index = this.index <= 0 ? this._menuItemList.length - 1 : this.index - 1
        return true
    }

    async handleEnterAndTab (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen || !this.keyboardSelectionChange) {
            return false
        }
        event.preventDefault()
        this._menuItemList[this.index].onClick()
        return true
    }

    handleEscape (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen || !this.keyboardSelectionChange) {
            return false
        }
        event.preventDefault()
        return true
    }
}
export default new MenuManager()
