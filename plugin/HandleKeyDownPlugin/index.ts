import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'
import {
    handleBackspaceInList, handleEnterInList,
    handleShiftTabInList,
    handleTabInList
} from './ListPlugin'
import { handleEnterInCode, handleShiftEnterInCode, handleTabInCode } from './CodeHandleKeyDownPlugin'
import CommandManager from '../../manager/Editing/Command/CommandManager'
import {
    moveSelectionWhenArrowLeftDown,
    moveSelectionWhenArrowRightDown,
    moveSelectionWhenCommandArrowLeftDown, moveSelectionWhenCommandArrowRightDown
} from './ArrowKeyMovementPlugin'
import { redoWhenControlYKeyDown, undoWhenControlZKeyDown } from './UndoPlugin'
import { insertNewLineWhenShiftEnterKeyDown } from './InsertNewLinePlugin'
import { handleEnterInVoid } from './CorrectVoidBehaviorHandleKeyDown'
import LinkManager from '../../manager/Editing/Link/LinkManager'
import { isMac } from 'lib0/environment'
import EditorPage from '../../manager/Blog/Editor/EditorPage'

const handlerMap = new Map()
handlerMap.set('ArrowLeft', [
    moveSelectionWhenArrowLeftDown
])
handlerMap.set('command+ArrowLeft', [
    moveSelectionWhenCommandArrowLeftDown
])
handlerMap.set('ArrowRight', [
    moveSelectionWhenArrowRightDown
])
handlerMap.set('command+ArrowRight', [
    moveSelectionWhenCommandArrowRightDown
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

const generalKeyDownHandlers = [
    PlaceHolderOnKeyDown,
    (event, editor) => EditorPage.editor.lastPressedKey = event.key
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
