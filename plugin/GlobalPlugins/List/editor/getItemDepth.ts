import { Editor, Path } from 'slate'
import { ListEditor } from '../../ListPlugin'

export const getItemDepth = (
    editor: Editor,
    path?: Path
): number => {
    const item = ListEditor.getCurrentItem(editor, path)

    if (item) {
        path = item[1]
    } else {
        return 0
    }

    const [, parentPath] = Editor.parent(editor, path)

    return 1 + getItemDepth(editor, parentPath)
}
