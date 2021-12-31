import { Editor } from 'slate'

export const DividerPlugin = (editor: Editor) => {
    const { isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'divider' ? true : isVoid(element)
    }

    return editor
}
