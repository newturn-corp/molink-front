import { Editor, Range, Transforms, Location, Path } from 'slate'
import EditorManager from '../../../manager/Blog/EditorManager'

export const customSelect = (editor: Editor, target: Location) => {
    const { selection } = editor
    target = Editor.range(editor, target)
    EditorManager.lastSelection = target
    if (selection) {
        Transforms.setSelection(editor, target)
    } else {
        if (!Range.isRange(target)) {
            throw new Error(
                `When setting the selection and the current selection is \`null\` you must provide at least an \`anchor\` and \`focus\`, but you passed: ${JSON.stringify(
                    target
                )}`
            )
        }

        editor.apply({
            type: 'set_selection',
            properties: selection,
            newProperties: target
        })
    }
}
