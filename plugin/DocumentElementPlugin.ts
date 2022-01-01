import { Editor } from 'slate'

export const DocumentElementPlugin = (editor: Editor) => {
    const { isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'document' ? true : isVoid(element)
    }
    return editor
}
