import { Node, Range, Text } from 'slate'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import { isMac } from 'lib0/environment'

const onKeyDown = (event, editor) => {
    const { selection } = editor
    if (!selection) {
        return
    }
    if (!Range.isCollapsed(selection)) {
        return
    }
    const node = Node.get(editor, selection.focus.path)
    if (!Text.isText(node)) {
        return
    }
    if (isMac) {
        EditorPage.editor.showPlaceholder = !(node.text === '' && event.keyCode === 229)
    } else {
        EditorPage.editor.showPlaceholder = !(node.text === '' && event.key === 'Process')
    }
}
export { onKeyDown }
