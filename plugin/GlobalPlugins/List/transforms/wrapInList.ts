import { Editor, NodeEntry, Transforms, Element, Path, Node, PathRef } from 'slate'
import { ListEditor, ListElement, ListOptions } from '../../ListPlugin'

type NodeRefEntry<T> = [T, PathRef];

const getHighestSelectedElements = (
    editor: Editor
): Array<NodeEntry<Element>> => {
    const selection = editor.selection
    if (!selection) {
        return []
    }

    if (Path.equals(selection.anchor.path, selection.focus.path)) {
        const ancestor = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n)
        })

        return [ancestor] as any
    }

    const ancestorPath = Path.common(
        selection.anchor.path,
        selection.focus.path
    )

    let startIndex = Path.relative(selection.anchor.path, ancestorPath)[0]
    let endIndex = Path.relative(selection.focus.path, ancestorPath)[0]
    if (startIndex > endIndex) {
        const temp = startIndex
        startIndex = endIndex
        endIndex = temp
    }
    return [...Node.children(editor, ancestorPath)].slice(
        startIndex,
        endIndex + 1
    ) as any
}

const convertPathsToRefs = (
    editor,
    nodeEntries: Array<NodeEntry<Node>>
): Array<NodeRefEntry<Node>> =>
    nodeEntries.map(([node, path]) => [node, Editor.pathRef(editor, path)])

const cleanupRefs = (
    nodeRefEntries: Array<NodeRefEntry<Node>>
): Array<NodeEntry<Node>> =>
    nodeRefEntries.map(([node, pathRef]) => [node, pathRef.unref()])

/**
 * Wrap the blocks in the current selection in a new list. Selected
 * lists are merged together.
 */
export const wrapInList = (
    editor: Editor,
    type?: string,
    data?: Object
): void => {
    type = type || ListOptions.types[0]

    Editor.withoutNormalizing(editor, () => {
        const selectedElements = convertPathsToRefs(
            editor,
            getHighestSelectedElements(editor)
        )
        const newList = {
            type,
            ...(data && { data })
        } as any

        Transforms.wrapNodes(editor, newList, {
            match: n => Editor.isBlock(editor, n)
        })

        // Wrap in list items
        selectedElements.forEach(([node, pathRef]) => {
            if (ListElement.isList(node)) {
                // Merge its items with the created list
                Transforms.unwrapNodes(editor, {
                    at: pathRef.current
                })
            } else {
                Transforms.wrapNodes(
                    editor,
                    { type: ListOptions.typeItem as any },
                    {
                        at: pathRef.current
                    }
                )
            }

            pathRef.unref()
        })

        cleanupRefs(selectedElements)
    })
}
