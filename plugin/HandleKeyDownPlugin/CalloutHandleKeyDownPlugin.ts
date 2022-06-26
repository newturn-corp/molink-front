import { isMac } from 'lib0/environment'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import { Editor, Element, Node, Transforms } from 'slate'
import { TextCategory } from '../../Types/slate/CustomElement'

const checkInsideCallout = (editor: Editor) => {
    const ancestors = Node.ancestors(editor, editor.selection.anchor.path)
    for (const [ancestor] of ancestors) {
        if (Element.isElement(ancestor) && ancestor.type === 'callout') {
            return true
        }
    }
    return false
}

export const handleEnterInCallout = (event, editor) => {
    if (isMac && EditorPage.editor.isComposing) {
        return false
    }
    if (!checkInsideCallout(editor)) {
        return false
    }
    event.preventDefault()
    editor.insertBreak()
    Transforms.setNodes(editor, {
        type: 'text',
        category: TextCategory.Content3
    })
    return true
}
