import { Element, Path, Transforms } from 'slate'
import EditorManager from '../../manager/Blog/EditorManager'

export const moveSelectionWhenArrowLeftDown = (event) => {
    event.preventDefault()
    Transforms.move(EditorManager.slateEditor, {
        unit: 'offset',
        reverse: true
    })
    return true
}

export const moveSelectionWhenArrowRightDown = (event) => {
    event.preventDefault()
    Transforms.move(EditorManager.slateEditor, { unit: 'offset' })
    return true
}

export const moveToTitleWhenArrowUpDown = (event) => {
    const { selection } = EditorManager.slateEditor
    if (selection) {
        const parentPath = Path.parent(selection.anchor.path)
        if (!Path.hasPrevious(parentPath)) {
            event.preventDefault()
            EditorManager.setTitleFocus()
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
        }
    }
    return false
}

export const moveSelectionWhenArrowDownDown = (event) => {
    const { selection } = EditorManager.slateEditor
    if (selection) {
        const parentPath = Path.parent(selection.anchor.path)
        console.log(Path.next(parentPath))
        // if (!Path.hasPrevious(parentPath)) {
        //     event.preventDefault()
        //     EditorManager.titleRef.current.focus()
        //     const range = globalThis.document.createRange()
        //     if (!EditorManager.titleRef.current.firstChild) {
        //         return
        //     }
        //     range.selectNodeContents(EditorManager.titleRef.current)
        //     console.log(EditorManager.titleRef.current.textContent)
        //     range.setStart(EditorManager.titleRef.current.firstChild, EditorManager.titleRef.current.textContent.length)
        //     range.setEnd(EditorManager.titleRef.current.firstChild, EditorManager.titleRef.current.textContent.length)
        //     const selection = window.getSelection()
        //     selection.removeAllRanges()
        //     selection.addRange(range)
        // }
    }
    return false
}

export const moveSelectionWhenBackspaceDown = (event) => {
    const { selection } = EditorManager.slateEditor
    if (selection) {
        if (selection.anchor.path[0] === 0 && selection.focus.offset === 0) {
            event.preventDefault()
            Transforms.removeNodes(EditorManager.slateEditor, {
                match: n => Element.isElement(n)
            })
            EditorManager.setTitleFocus()
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
            return true
        }
    }
}
