import { Editor, NodeEntry, Transforms } from 'slate'
import { ListEditor } from '../../ListPlugin'

export const unwrapList = (editor: Editor): void => {
    const items: Array<NodeEntry> = ListEditor.getTopmostItemsAtRange(editor)

    if (items.length === 0) {
        return
    }

    Editor.withoutNormalizing(editor, () => {
        const itemPaths = items.map(([, itemPath]) =>
            Editor.pathRef(editor, itemPath)
        )

        itemPaths.forEach(itemPath => {
            Transforms.liftNodes(editor, {
                at: itemPath.current
            })
            Transforms.unwrapNodes(editor, {
                at: itemPath.current
            })
            itemPath.unref()
        })
    })
}
