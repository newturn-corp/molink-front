import { Editor, Text, Transforms } from 'slate'
import EditorPage from '../../manager/Blog/Editor/EditorPage'

const isFormatActive = (editor, format) => {
    try {
        const [match] = Editor.nodes(editor, {
            match: n => n[format] === true,
            universal: true
        })
        return !!match
    } catch {
        // eslint-disable-next-line no-unsafe-finally
        return false
    }
}

const toggleFormat = (editor, format) => {
    const isActive = isFormatActive(editor, format)
    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
    )
}

export default (event: InputEvent) => {
    const slateEditor = EditorPage.editor.slateEditor
    switch (event.inputType) {
    case 'formatBold':
        event.preventDefault()
        return toggleFormat(slateEditor, 'bold')
    case 'formatItalic':
        event.preventDefault()
        return toggleFormat(slateEditor, 'italic')
    case 'formatUnderline':
        event.preventDefault()
        return toggleFormat(slateEditor, 'underlined')
    }
}
