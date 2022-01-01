import { Node, Range, Text } from 'slate'
import EditorManager from '../manager/EditorManager'
import { EditorKeyDownHandler } from '../utils/slate'

const onKeyDown: EditorKeyDownHandler = (event, editor) => {
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
