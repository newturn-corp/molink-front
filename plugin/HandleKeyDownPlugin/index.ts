import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'
import {
    handleBackspaceInList, handleEnterInList,
    handleShiftTabInList,
    handleTabInList
} from './ListPlugin'
import {
    handleEnterInCode,
    handleShiftEnterInCode,
    handleSpaceInCodeMark,
    handleTabInCode
} from './CodeHandleKeyDownPlugin'
import CommandManager from '../../manager/Editing/Command/CommandManager'
import {
    moveSelectionWhenCommandArrowLeftDown, moveSelectionWhenCommandArrowRightDown
} from './ArrowKeyMovementPlugin'
import { redoWhenControlYKeyDown, undoWhenControlZKeyDown } from './UndoPlugin'
import { insertNewLineWhenShiftEnterKeyDown } from './InsertNewLinePlugin'
import { handleEnterInVoid } from './CorrectVoidBehaviorHandleKeyDown'
import LinkManager from '../../manager/Editing/Link/LinkManager'
import { isMac } from 'lib0/environment'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import { handleHead1Shortcut, handleHead2Shortcut, handleHead3Shortcut } from './ShortcutKeyPlugin'

const handlerMap = new Map()
handlerMap.set('command+ArrowLeft', [
    moveSelectionWhenCommandArrowLeftDown
])
handlerMap.set('command+ArrowLeft', [
    moveSelectionWhenCommandArrowLeftDown
])
handlerMap.set('command+ArrowRight', [
    moveSelectionWhenCommandArrowRightDown
])
handlerMap.set('command+1', [
    handleHead1Shortcut
])
handlerMap.set('command+2', [
    handleHead2Shortcut
])
handlerMap.set('command+2', [
    handleHead3Shortcut
])

handlerMap.set('ArrowUp', [
    (event, editor) => LinkManager.menu.handleArrowUp(event, editor),
    (event, editor) => CommandManager.handleArrowUp(event, editor)
])
handlerMap.set('ArrowDown', [
    (event, editor) => LinkManager.menu.handleArrowDown(event, editor),
    (event, editor) => CommandManager.handleArrowDown(event, editor)
])

handlerMap.set('ctrl+z', [
    (event) => LinkManager.menu.handleCtrlZDown(event),
    undoWhenControlZKeyDown
])
handlerMap.set('ctrl+y', [
    redoWhenControlYKeyDown
])
handlerMap.set('ctrl+s', [
    (event) => event.preventDefault()
])
handlerMap.set('ctrl+1', [
    handleHead1Shortcut
])
handlerMap.set('ctrl+2', [
    handleHead2Shortcut
])
handlerMap.set('ctrl+3', [
    handleHead3Shortcut
])

handlerMap.set('Backspace', [
    handleBackspaceInList
])
handlerMap.set('Tab', [
    (event, editor) => LinkManager.menu.handleEnterAndTab(event, editor),
    (event, editor) => CommandManager.handleEnterAndTabAndClick(event, editor),
    handleTabInCode,
    handleTabInList
])
handlerMap.set('shift+Tab', [
    handleShiftTabInList
])
handlerMap.set('Enter', [
    (event, editor) => LinkManager.menu.handleEnterAndTab(event, editor),
    (event, editor) => CommandManager.handleEnterAndTabAndClick(event, editor),
    handleEnterInList,
    handleEnterInCode,
    handleEnterInVoid
])
handlerMap.set('shift+Enter', [
    handleShiftEnterInCode,
    insertNewLineWhenShiftEnterKeyDown
])
handlerMap.set('Escape', [
    (event, editor) => LinkManager.menu.handleEscape(event, editor),
    (event, editor) => CommandManager.handleEscape(event, editor)
])
handlerMap.set(' ', [
    handleSpaceInCodeMark
])

const generalKeyDownHandlers = [
    PlaceHolderOnKeyDown,
    (event, editor) => {
        EditorPage.editor.lastPressedKey = event.key
    }
]

export const handleKeyDown = (event, editor) => {
    for (const handler of generalKeyDownHandlers) {
        handler(event, editor)
    }

    const keys = []
    if (event.shiftKey) {
        keys.push('shift')
    } else if (event.altKey) {
        keys.push('alt')
    } else if (event.ctrlKey) {
        keys.push('ctrl')
    } else if (event.metaKey) {
        if (isMac) {
            keys.push('command')
        }
    }
    keys.push(event.key)
    const eventKey = keys.join('+')

    const handlers = handlerMap.get(eventKey)
    if (!handlers || handlers.length === 0) {
        return false
    }
    for (const handler of handlers) {
        const isHandled = handler(event, editor)
        if (isHandled) {
            return true
        }
    }
    return false
}
