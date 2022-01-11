import { Editor } from 'slate'
import { EditorKeyDownHandler } from '../utils/slate'
import { maintainBottomMargin } from './BottomMarginPlugin'
import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'

export type InsertBreakHandler = (editor: Editor) => void

const onKeyDownHandlers: EditorKeyDownHandler[] = [PlaceHolderOnKeyDown]
const voidTypeList: string[] = ['divider', 'image', 'document', 'mention']
const inlineTyleList: string[] = ['mention']
const beforeInsertBreakHandlers: InsertBreakHandler[] = [maintainBottomMargin]
const afterInsertBreakHandlers: InsertBreakHandler[] = []

export const onKeyDown: EditorKeyDownHandler = (event, editor) => {
    onKeyDownHandlers.forEach(handler => {
        handler(event, editor)
    })
}

export const plugin = (editor: Editor) => {
    const { isVoid, isInline, insertBreak } = editor

    editor.isVoid = element => {
        return voidTypeList.includes(element.type) || isVoid(element)
    }

    editor.isInline = element => {
        return inlineTyleList.includes(element.type) || isInline(element)
    }

    editor.insertBreak = () => {
        beforeInsertBreakHandlers.forEach(handler => {
            handler(editor)
        })
        insertBreak()
        afterInsertBreakHandlers.forEach(handler => {
            handler(editor)
        })
    }

    return editor
}
