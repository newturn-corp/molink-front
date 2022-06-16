import React from 'react'
import { makeAutoObservable } from 'mobx'
import EventManager from '../../../global/Event/EventManager'
import { Event } from '../../../global/Event/Event'
import { LinkElement } from '../../../../Types/slate/CustomElement'
import GlobalManager from '../../../global/GlobalManager'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../../global/FeedbackManager'
import EditorPage from '../EditorPage'
import { Editor, Element, Node, Transforms } from 'slate'
import RoutingManager from '../../../global/RoutingManager'

export class EditorLinkModifier {
    slateLinkElement: LinkElement = null
    linkModifierRef: React.MutableRefObject<HTMLDivElement> = null
    linkRef: React.MutableRefObject<HTMLAnchorElement> = null
    isOpen: boolean = false
    index: number = 0

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.PageBodyClick, () => {
            this.isOpen = false
        }, 1)
        EventManager.addEventListener(Event.WindowResize, () => {
            if (this.isOpen) {
                this.setModifierPosition()
            }
        }, 1)
    }

    open (linkElement: LinkElement, linkRef: React.MutableRefObject<HTMLAnchorElement>, margin: number = 100) {
        if (this.isOpen) {
            return
        }
        this.slateLinkElement = linkElement
        this.linkRef = linkRef
        this.index = 0
        setTimeout(() => {
            this.setModifierPosition()
            this.isOpen = true
        }, 0)
    }

    setModifierPosition () {
        const rect = this.linkRef.current.getBoundingClientRect()
        const linkModifierElement = this.linkModifierRef.current
        const linkModifierElementRect = linkModifierElement.getBoundingClientRect()

        const position = {
            top: rect.top + rect.height + linkModifierElementRect.height + 10,
            left: rect.left + rect.width / 2 - linkModifierElementRect.width / 2
        }

        if (globalThis.document.body.clientHeight < position.top + linkModifierElement.offsetHeight + 100) {
            linkModifierElement.style.top = `${position.top - linkModifierElement.offsetHeight - 5}px`
        } else {
            linkModifierElement.style.top = `${position.top + 5}px`
        }
        if (global.document.body.clientWidth < position.left + linkModifierElement.offsetWidth + 100) {
            linkModifierElement.style.left = `${position.left - linkModifierElement.offsetWidth}px`
        } else {
            linkModifierElement.style.left = `${position.left}px`
        }
    }

    async copyLink () {
        await GlobalManager.navigator.clipboard.writeText(this.slateLinkElement.url)
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '클립보드에 복사되었습니다!', '', 5)
    }

    async deleteLink () {
        const editor = EditorPage.editor.slateEditor
        Transforms.unwrapNodes(editor, {
            match: (n : Node) =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                (n as Element).type === 'link' &&
                (n as LinkElement).url === this.slateLinkElement.url
        })
    }

    async moveToLinkPage () {
        await RoutingManager.rawMoveTo(this.slateLinkElement.url, true)
    }

    public close () {
        this.isOpen = false
        this.index = 0
        this.linkModifierRef.current.style.top = '-9999px'
        this.linkModifierRef.current.style.left = '-9999px'
    }

    handleArrowDown (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen) {
            return false
        }
        event.preventDefault()
        if (this.index === 2) {
            this.index = 0
        } else {
            this.index += 1
        }
        return true
    }

    handleArrowUp (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen) {
            return false
        }
        event.preventDefault()
        if (this.index === 0) {
            this.index = 2
        } else {
            this.index -= 1
        }
        return true
    }

    async handleEnter (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen) {
            return false
        }
        event.preventDefault()
        if (this.index === 0) {
            await this.moveToLinkPage()
        } else if (this.index === 1) {
            await this.copyLink()
        } else if (this.index === 2) {
            await this.deleteLink()
        }
        this.close()
        return true
    }

    handleEscape (event: React.KeyboardEvent, editor: Editor) {
        if (!this.isOpen) {
            return false
        }
        event.preventDefault()
        return true
    }
}
