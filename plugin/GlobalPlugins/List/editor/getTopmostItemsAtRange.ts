import { Editor, Element, Node, NodeEntry, Path, Range } from 'slate'
import { ListEditor, ListElement, ListTransforms } from '../../ListPlugin'

const takeOnlyDirectChildren = ancestorPath => ([, listItemPath]) =>
    listItemPath.length === ancestorPath.length + 1

export const getTopmostItemsAtRange = (
    editor: Editor,
    range?: Range
): Array<NodeEntry<Element>> => {
    range = range || editor.selection

    if (!range) {
        return []
    }

    const [startElement, startElementPath] = Editor.parent(
        editor,
        Range.start(range)
    )
    const [endElement, endElementPath] = Editor.parent(
        editor,
        Range.end(range)
    )

    if (startElement === endElement) {
        const item = ListEditor.getCurrentItem(editor, startElementPath)
        return item ? [item] : []
    }

    let ancestorPath = Path.common(startElementPath, endElementPath)
    let ancestor = Node.get(editor, ancestorPath)

    if (Editor.isEditor(ancestor)) {
        const topMostLists = [
            ...Editor.nodes(editor, {
                at: range,
                match: ListElement.isList,
                mode: 'highest'
            })
        ]

        return topMostLists.reduce((items, [, listPath]) => {
            const topMostListItems = [
                ...Editor.nodes(editor, {
                    at: listPath,
                    match: ListElement.isItem,
                    mode: 'highest'
                })
            ]

            return items.concat(topMostListItems)
        }, [])
    }

    while (ancestorPath.length !== 0) {
        if (ListElement.isList(ancestor)) {
            return [
                ...Editor.nodes(editor, {
                    at: range,
                    match: ListElement.isItem
                })
                // We want only the children of the ancestor
                // aka the topmost possible list items in the selection
            ].filter(takeOnlyDirectChildren(ancestorPath)) as any
        } else if (ListElement.isItem(ancestor)) {
            // The ancestor is the highest list item that covers the range
            return [[ancestor, ancestorPath]] as any
        }

        ancestorPath = ancestorPath.slice(0, -1)
        ancestor = Node.get(editor, ancestorPath)
    }

    // No list of items can cover the range
    return []
}
