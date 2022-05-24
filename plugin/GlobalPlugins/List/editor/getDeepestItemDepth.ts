import { Editor, Path } from 'slate'
import { ListElement } from '../../ListPlugin'

export const getDeepestItemDepth = (
    editor: Editor,
    path: Path
): number =>
    [
        ...Editor.nodes(editor, {
            at: path,
            match: ListElement.isItem
        })
    ].reduce(
        (maxLevel, [, itemPath]) =>
            Math.max(maxLevel, itemPath.length - path.length),
        0
    )
