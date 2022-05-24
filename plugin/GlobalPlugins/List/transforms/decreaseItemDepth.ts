import { Editor, Path, Transforms } from 'slate'
import { ListEditor } from '../../ListPlugin'

export const decreaseItemDepth = (
    editor: Editor,
    path?: Path
): void => {
    if (ListEditor.getItemDepth(editor, path) === 1) {
        return
    }

    const currentItemTuple = ListEditor.getCurrentItem(editor, path)

    if (!currentItemTuple) {
        return
    }

    const [currentItem, currentItemPath] = currentItemTuple
    const [currentList, currentListPath] = Editor.parent(
        editor,
        currentItemPath
    ) as any
    const parentItemPath = Path.parent(currentListPath)
    const parentListPath = Path.parent(parentItemPath)
    const followingItems = currentList.children.slice(
        Path.relative(currentItemPath, currentListPath)[0] + 1
    )
    console.log('currentItem')
    console.log(currentItem)
    console.log('currentList')
    console.log(currentList)
    console.log('followingItems')
    console.log(followingItems)
    const currentListPathRef = Editor.pathRef(editor, currentListPath)

    Editor.withoutNormalizing(editor, () => {
        if (followingItems.length > 0) {
            const newList = {
                type: currentList.type,
                ...(currentList.data && { data: currentList.data }),
                children: followingItems
            }

            Transforms.removeNodes(editor, {
                at: currentListPath,
                match: n => followingItems.includes(n)
            })

            Transforms.insertNodes(editor, newList, {
                at: currentItemPath.concat([currentItem.children.length])
            })

            Transforms.moveNodes(editor, {
                at: currentItemPath,
                to: parentListPath.concat([
                    Path.relative(parentItemPath, parentListPath)[0] + 1
                ])
            })
        } else {
            Transforms.moveNodes(editor, {
                at: currentItemPath,
                to: parentListPath.concat([
                    Path.relative(parentItemPath, parentListPath)[0] + 1
                ])
            })
        }

        const hasCurrentListChildren =
            (Editor.node(editor, currentListPathRef.current)[0] as any).children.length >
            0

        if (!hasCurrentListChildren) {
            Transforms.removeNodes(editor, {
                at: currentListPathRef.current
            })
        }

        const hasParentItemBlocks = (Editor.node(
            editor,
            parentItemPath
        )[0] as any).children.some(node => Editor.isBlock(editor, node))

        if (!hasParentItemBlocks) {
            Transforms.removeNodes(editor, {
                at: parentItemPath
            })
        }
    })

    currentListPathRef.unref()
}
