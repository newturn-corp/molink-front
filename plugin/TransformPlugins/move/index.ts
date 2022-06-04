import { Editor, Range, Transforms } from 'slate'

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
