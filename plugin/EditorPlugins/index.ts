import { Editor, NodeEntry, Node } from 'slate'
import {
    DeleteBackwardHandler,
    InsertBreakHandler,
    InsertDataHandler,
    InsertTextHandler,
    NormalizeNodeHandler, SplitNodeHandler
} from './types'
import { CorrectVoidBehaviorWhenDeleteBackward, CorrectVoidBehaviorWhenInsertBreak } from './CorrectVoidBehavior'
import { WrapLinkWhenInsertData, WrapLinkWhenInsertText } from './LinkPlugin'
import { InsertImageWhenInsertData } from './ImagePlugin'
import { ShortcutWhenDeleteBackward, ShortcutWhenInsertText } from './ShortcutPlugin'
import { insertYoutubeWhenInsertData } from './YoutubePlugin'
import CommandManager from '../../manager/Editing/Command/CommandManager'
import { insertCodeWhenInsertData } from './CodeEditorPlugin'
import { correctDeleteBackwardInHeader } from './HeaderDeleteBackwardPlugin'
import { fixContentNextHeaderWhenSplitNodes } from './FixContentNextHeaderPlugin'

export const EditorPlugin = (editor: Editor) => {
    const { isVoid, isInline, insertBreak, deleteBackward, normalizeNode, insertText, insertData, onChange } = editor

    const voidTypeList: string[] = ['divider', 'image', 'document', 'mention', 'youtube']
    editor.isVoid = element => {
        return voidTypeList.includes(element.type) || isVoid(element)
    }

    const inlineStyleList: string[] = ['mention', 'link', 'button']
    editor.isInline = element => {
        return inlineStyleList.includes(element.type) || isInline(element)
    }

    const deleteBackwardHandlers: DeleteBackwardHandler[] = [CorrectVoidBehaviorWhenDeleteBackward, ShortcutWhenDeleteBackward, correctDeleteBackwardInHeader]
    editor.deleteBackward = unit => {
        for (const handler of deleteBackwardHandlers) {
            const handled = handler(editor, unit)
            if (handled) {
                return
            }
        }
        deleteBackward(unit)
    }

    const insertBreakHandlers: InsertBreakHandler[] = [CorrectVoidBehaviorWhenInsertBreak]
    editor.insertBreak = () => {
        for (const handler of insertBreakHandlers) {
            const handled = handler(editor)
            if (handled) {
                return
            }
        }
        insertBreak()
    }

    // const normalizeNodeHandlers: NormalizeNodeHandler[] = [FixLayoutWhenNormalizeNode]
    // editor.normalizeNode = (entry: NodeEntry<Node>) => {
    //     for (const handler of normalizeNodeHandlers) {
    //         const handled = handler(editor, entry)
    //         if (handled) {
    //             return
    //         }
    //     }
    //     normalizeNode(entry)
    // }

    const insertTextHandlers: InsertTextHandler[] = [
        WrapLinkWhenInsertText,
        ShortcutWhenInsertText
    ]
    editor.insertText = (text: string) => {
        for (const handler of insertTextHandlers) {
            const handled = handler(editor, text)
            if (handled) {
                return
            }
        }
        insertText(text)
    }

    const insertDataHandlers: InsertDataHandler[] = [
        insertCodeWhenInsertData,
        insertYoutubeWhenInsertData,
        InsertImageWhenInsertData,
        WrapLinkWhenInsertData
    ]
    editor.insertData = (data: DataTransfer) => {
        for (const handler of insertDataHandlers) {
            const handled = handler(editor, data)
            if (handled) {
                return
            }
        }
        insertData(data)
    }

    editor.onChange = () => {
        CommandManager.handleEditorChange(editor)
        onChange()
    }

    return editor
}
