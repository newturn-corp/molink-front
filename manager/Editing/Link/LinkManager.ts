import { LinkMenu } from './LinkMenu'
import { LinkHoveringToolbar } from './LinkHoveringToolbar'
import { Editor, Element, Range, Transforms } from 'slate'
import isUrl from 'is-url'
import { LinkElement } from '../../../Types/slate/CustomElement'
import { LinkModal } from './LinkModal'
import { isBrowser } from 'react-device-detect'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../global/FeedbackManager'

export interface LinkOption {
    reference: string
    text: string
    url: string
    icon: string
}

export class LinkManager {
    menu: LinkMenu
    hoveringToolbar: LinkHoveringToolbar
    modal: LinkModal

    constructor () {
        this.menu = new LinkMenu(this)
        this.hoveringToolbar = new LinkHoveringToolbar()
        this.modal = new LinkModal()
    }

    public handleInsertText (editor: Editor, text: string) {
        if (text && isUrl(text)) {
            this.wrapLink(editor, text)
            return true
        }
        return false
    }

    public handleInsertData (editor: Editor, data: DataTransfer) {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
            this.wrapLink(editor, text)
            return true
        }
        return false
    }

    private unwrapLink (editor) {
        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
        })
    }

    isLinkActive (editor) {
        const [link] = Editor.nodes(editor, {
            match: n =>
                !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
        })
        return !!link
    }

    private wrapLink (editor, url: string) {
        if (this.isLinkActive(editor)) {
            this.unwrapLink(editor)
        }

        const { selection } = editor
        const isCollapsed = selection && Range.isCollapsed(selection)
        const link: LinkElement = {
            type: 'link',
            url,
            children: isCollapsed ? [{ text: url }] : []
        }

        if (isCollapsed) {
            Transforms.insertNodes(editor, link)
            this.menu.open(url)
        } else {
            Transforms.wrapNodes(editor, link, { split: true })
            Transforms.collapse(editor, { edge: 'end' })
        }
    }
}
export default new LinkManager()
