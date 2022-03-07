import { Editor, Location, Range } from 'slate'
import { ReactEditor } from 'slate-react'
import StyleManager from '../../manager/global/Style/StyleManager'
import EditorManager from '../../manager/Blog/EditorManager'

export const maintainScreenMargin = (editor: Editor, location: Location) => {
    const root = ReactEditor.findDocumentOrShadowRoot(EditorManager.slateEditor) as Document
    const domSelection = root.getSelection()
    if (!domSelection) {
        return
    }
    const { anchorNode, focusNode } = domSelection
    const range = location as Range
    if (!range || !range.focus) {
        return false
    }
    const nextElement = editor.children[range.focus.path[0]]
    const aaa = EditorManager.editableElement
    if (!EditorManager.editableElement) {
        return false
    }
    const bbb = aaa.children[range.focus.path[0]]
    // const domSelection = window.getSelection()
    // const domRange = domSelection.getRangeAt(0)
    // const rect = domRange.getBoundingClientRect()

    const rect = bbb.getBoundingClientRect()
    const contentContainer = EditorManager.contentBody
    const cursorTop = rect.top - StyleManager.contentStyle.body.top - 56
    const clientHeight = contentContainer.clientHeight
    // console.log(cursorTop)
    // console.log(clientHeight)
    //
    // // const aaa = contentContainer.scrollHeight - contentContainer.scrollTop
    // // console.log(rect.top - StyleManager.contentStyle.body.top - 56)
    // // console.log(StyleManager.contentStyle.body.height * 0.8)
    console.log(cursorTop)
    if (cursorTop < clientHeight * 0.2) {
        console.log('top')
        contentContainer.scrollTop -= (clientHeight * 0.2 - cursorTop)
    } else if (cursorTop > clientHeight * 0.8) {
        console.log('bottom')
        contentContainer.scrollTop += (cursorTop - clientHeight * 0.8)
    }
    return false
}