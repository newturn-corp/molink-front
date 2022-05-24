import { Editor, NodeEntry, Path, Element } from 'slate'
import { ListEditor, ListElement } from '../../ListPlugin'

export const getListForItem = (
    editor: Editor,
    path: Path
): NodeEntry<Element> => {
    return Editor.above(editor, {
        at: path,
        match: node => ListElement.isList(node)
    }) || null
}
