import { Editor } from 'slate'

export const withMentions = (editor: Editor) => {
    const { isInline, isVoid } = editor

    editor.isInline = element => {
        return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = element => {
        return element.type === 'mention' ? true : isVoid(element)
    }
    return editor
}
