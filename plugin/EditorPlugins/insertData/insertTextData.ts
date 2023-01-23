import { Transforms } from 'slate'

export const insertTextData = (editor, data) => {
    const text = data.getData('text/plain')
    console.log(editor.children)
    if (text) {
        const lines = text.split(/\r\n|\r|\n/)
        console.log(lines)
        let split = false

        for (const line of lines) {
            if (split) {
                console.log('split')
                Transforms.splitNodes(editor, { always: true })
            }
            console.log('insert ' + line)
            editor.insertText(line)
            console.log(editor.children)
            split = true
        }
        return true
    }
    return false
}