import { Editor, Path, Range, Transforms } from 'slate'
import EditorManager from '../../../manager/Blog/EditorManager'

export const move = (
    editor: Editor,
    options: {
    distance?: number
    unit?: 'offset' | 'character' | 'word' | 'line'
    reverse?: boolean
    edge?: 'anchor' | 'focus' | 'start' | 'end'
} = {}
): void => {
    const { selection } = editor
    const { distance = 1, unit = 'character', reverse = false } = options
    let { edge = null } = options

    if (!selection) {
        return
    }
    const parentPath = Path.parent(selection.focus.path)
    if (!Path.hasPrevious(parentPath) && selection.focus.offset === 0 && reverse) {
        EditorManager.titleRef.current.focus()
        const range = globalThis.document.createRange()
        if (!EditorManager.titleRef.current.firstChild) {
            return
        }
        range.selectNodeContents(EditorManager.titleRef.current)
        range.setStart(EditorManager.titleRef.current.firstChild, EditorManager.titleRef.current.textContent.length)
        range.setEnd(EditorManager.titleRef.current.firstChild, EditorManager.titleRef.current.textContent.length)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        return
    }

    if (edge === 'start') {
        edge = Range.isBackward(selection) ? 'focus' : 'anchor'
    }

    if (edge === 'end') {
        edge = Range.isBackward(selection) ? 'anchor' : 'focus'
    }

    const { anchor, focus } = selection
    const opts = { distance, unit }
    const props: Partial<Range> = {}

    if (edge == null || edge === 'anchor') {
        const point = reverse
            ? Editor.before(editor, anchor, opts)
            : Editor.after(editor, anchor, opts)

        if (point) {
            props.anchor = point
        }
    }

    if (edge == null || edge === 'focus') {
        const point = reverse
            ? Editor.before(editor, focus, opts)
            : Editor.after(editor, focus, opts)

        if (point) {
            props.focus = point
        }
    }

    Transforms.setSelection(editor, props)
}
