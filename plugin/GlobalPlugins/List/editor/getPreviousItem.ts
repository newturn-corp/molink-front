import { Editor, Path, NodeEntry, Element, Node } from 'slate'
import { ListEditor, ListOptions } from '../../ListPlugin'

export const getPreviousItem = (
    editor: Editor,
    path?: Path
): NodeEntry<Element> => {
    const [currentItem, currentItemPath] = ListEditor.getCurrentItem(
        editor,
        path
    )
    if (!currentItem) {
        return null
    }

    let previousSiblingPath = null

    try {
        previousSiblingPath = Path.previous(currentItemPath)
    } catch (e) {
        // Slate throws when trying to find
        // previous of a first element
        // we interpret it as there not being a previous item
        return null
    }

    const previousSibling = Node.get(editor, previousSiblingPath) as Element

    if (!previousSibling) {
        return null
    } else if (['list-item', 'check-list-item'].includes(previousSibling.type)) {
        return [previousSibling, previousSiblingPath]
    }
    return null
}
