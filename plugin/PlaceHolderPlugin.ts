import { Node, Range, Text } from 'slate'
import EditorManager from '../manager/EditorManager'

const onKeyDown = (event, editor) => {
    const { selection } = editor
    if (!Range.isCollapsed(selection)) {
        return
    }
    const node = Node.get(editor, selection.focus.path)
    if (!Text.isText(node)) {
        return
    }
    EditorManager.showPlaceholder = !(node.text === '' && event.key === 'Process')
}
export { onKeyDown }
