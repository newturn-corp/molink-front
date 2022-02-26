import isUrl from 'is-url'
import { Editor, Transforms, Element, Range } from 'slate'
import { LinkElement } from '../../Types/slate/CustomElement'

const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
    })
}

const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
    })
    return !!link
}

const wrapLink = (editor, url: string) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
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
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}

export const WrapLinkWhenInsertText = (editor: Editor, text: string) => {
    if (text && isUrl(text)) {
        wrapLink(editor, text)
        return true
    }
    return false
}

export const WrapLinkWhenInsertData = (editor: Editor, data: DataTransfer) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
        wrapLink(editor, text)
        return true
    }
    return false
}
