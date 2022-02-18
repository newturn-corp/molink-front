import { Editor, NodeEntry, Node } from 'slate'
import {
    DeleteBackwardHandler,
    InsertBreakHandler,
    InsertDataHandler,
    InsertTextHandler,
    NormalizeNodeHandler
} from './types'
import { CorrectVoidBehaviorWhenDeleteBackword, CorrectVoidBehaviorWhenInsertBreak } from './CorrectVoidBehavior'
import { FixLayoutWhenNormalizeNode } from './LayoutPlugin'
import { WrapLinkWhenInsertData, WrapLinkWhenInsertText } from './LinkPlugin'
import { InsertImageWhenInsertData } from './ImagePlugin'
import { maintainBottomMargin } from './BottomMarginPlugin'
import { ShortcutWhenDeleteBackward, ShortcutWhenInsertText } from './ShortcutPlugin'
import CommandManager from '../../manager/Editing/CommandManager'
import { insertYoutubeWhenInsertData } from './YoutubePlugin'

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

    const deleteBackwardHandlers: DeleteBackwardHandler[] = [CorrectVoidBehaviorWhenDeleteBackword, ShortcutWhenDeleteBackward]
    editor.deleteBackward = unit => {
        for (const handler of deleteBackwardHandlers) {
            const handled = handler(editor, unit)
            if (handled) {
                return
            }
        }
        deleteBackward(unit)
    }

    const insertBreakHandlers: InsertBreakHandler[] = [CorrectVoidBehaviorWhenInsertBreak, maintainBottomMargin]
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
        insertYoutubeWhenInsertData,
        WrapLinkWhenInsertData,
        InsertImageWhenInsertData
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
