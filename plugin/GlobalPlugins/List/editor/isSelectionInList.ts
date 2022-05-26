import { Editor } from 'slate'
import { ListEditor } from '../../ListPlugin'

export const isSelectionInList = (
    editor: Editor
): boolean => ListEditor.getTopmostItemsAtRange(editor).length !== 0
