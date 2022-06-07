import { Editor, NodeEntry, Node } from 'slate'
import {
    DeleteBackwardHandler, DeleteForwardHandler,
    InsertBreakHandler,
    InsertDataHandler,
    InsertTextHandler
} from './types'
import { CorrectVoidBehaviorWhenDeleteBackward, CorrectVoidBehaviorWhenInsertBreak } from './CorrectVoidBehavior'
import { ShortcutWhenDeleteBackward, ShortcutWhenInsertText } from './ShortcutPlugin'
import { insertYoutubeWhenInsertData } from './YoutubePlugin'
import CommandManager from '../../manager/Editing/Command/CommandManager'
import { insertCodeWhenInsertData } from './CodeEditorPlugin'
import { correctDeleteBackwardInHeader } from './HeaderDeleteBackwardPlugin'
import { isBrowser } from 'react-device-detect'
import { setFragmentData } from './setFragmentData'
import FileManager from '../../manager/Editing/FileManager'
import { handleDeleteBackwardAfterMedia, handleDeleteForwardAfterMedia } from './MediaPlugin'
import FormattingManager from '../../manager/Editing/FormattingManager'
import LinkManager from '../../manager/Editing/Link/LinkManager'
import { insertHTMLWhenInsertData } from './InsertHTMLWhenInsertData'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'

export const EditorPlugin = (editor: Editor) => {
    const { isVoid, isInline, insertBreak, deleteBackward, deleteForward, normalizeNode, insertText, insertData, onChange, insertNode } = editor

    const voidTypeList: string[] = ['divider', 'image', 'document', 'mention', 'youtube', 'video', 'file', 'bookmark']
    editor.isVoid = element => {
        return voidTypeList.includes(element.type) || isVoid(element)
    }

    const inlineStyleList: string[] = ['mention', 'link', 'button']
    editor.isInline = element => {
        return inlineStyleList.includes(element.type) || isInline(element)
    }

    editor.insertNode = node => {
        insertNode(node)
    }

    editor.setFragmentData = data => {
        setFragmentData(editor, data)
    }

    const deleteBackwardHandlers: DeleteBackwardHandler[] = [
        handleDeleteBackwardAfterMedia,
        CorrectVoidBehaviorWhenDeleteBackward,
        ShortcutWhenDeleteBackward,
        correctDeleteBackwardInHeader
    ]
    editor.deleteBackward = unit => {
        for (const handler of deleteBackwardHandlers) {
            const handled = handler(editor, unit)
            if (handled) {
                return
            }
        }
        deleteBackward(unit)
    }

    const deleteForwardHandlers: DeleteForwardHandler[] = [
        handleDeleteForwardAfterMedia
    ]
    editor.deleteForward = unit => {
        for (const handler of deleteForwardHandlers) {
            const handled = handler(editor, unit)
            if (handled) {
                return
            }
        }
        deleteForward(unit)
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

    const insertTextHandlers: InsertTextHandler[] = [
        (editor, text) => LinkManager.handleInsertText(editor, text),
        ShortcutWhenInsertText
    ]
    editor.insertText = async (text: string) => {
        for (const handler of insertTextHandlers) {
            const handled = await handler(editor, text)
            if (handled) {
                return
            }
        }
        insertText(text)
    }

    const insertDataHandlers: InsertDataHandler[] = [
        insertCodeWhenInsertData,
        insertYoutubeWhenInsertData,
        (editor, data) => FileManager.handleInsertData(editor, data),
        (editor, data) => LinkManager.handleInsertData(editor, data),
        insertHTMLWhenInsertData
    ]
    editor.insertData = async (data: DataTransfer) => {
        for (const handler of insertDataHandlers) {
            const handled = await handler(editor, data)
            if (handled) {
                return
            }
        }
        insertData(data)
    }

    editor.onChange = () => {
        EventManager.issueEvent(Event.EditorChange)
        if (isBrowser) {
            CommandManager.handleEditorChange(editor)
        }
        FormattingManager.handleEditorChange()
        onChange()
    }

    return editor
}
