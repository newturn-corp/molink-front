import { Transforms } from 'slate'

export const insertTextData = (editor, data) => {
    const text = data.getData('text/plain')
    if (text) {
        const lines = text.split(/\r\n|\r|\n/)
        console.log(lines)
        let split = false

        for (const line of lines) {
            if (split) {
                Transforms.splitNodes(editor, { always: true })
            }
            editor.insertText(line)
            split = true
        }
        return true
    }
    return false
}
