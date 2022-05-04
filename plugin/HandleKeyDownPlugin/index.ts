import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'
import {
    handleBackspaceInList, handleEnterInList,
    handleShiftTabInList,
    handleTabInList
} from './ListPlugin'
import { handleEnterInCode, handleShiftEnterInCode, handleTabInCode } from './CodeHandleKeyDownPlugin'
import CommandManager from '../../manager/Editing/Command/CommandManager'
import {
    moveSelectionWhenArrowDownDown,
    moveSelectionWhenArrowLeftDown,
    moveSelectionWhenArrowRightDown, moveSelectionWhenBackspaceDown, moveToTitleWhenArrowUpDown
} from './ArrowKeyMovementPlugin'
import { redoWhenControlYKeyDown, undoWhenControlZKeyDown } from './UndoPlugin'
import { insertNewLineWhenShiftEnterKeyDown } from './InsertNewLinePlugin'
import { handleEnterInVoid } from './CorrectVoidBehaviorHandleKeyDown'
import EditorManager from '../../manager/Blog/EditorManager'
import LinkManager from '../../manager/Editing/Link/LinkManager'

const handlerMap = new Map()
handlerMap.set('ArrowLeft', [
    moveSelectionWhenArrowLeftDown
])
handlerMap.set('ArrowRight', [
    moveSelectionWhenArrowRightDown
])
handlerMap.set('ArrowUp', [
    (event, editor) => LinkManager.menu.handleArrowUp(event, editor),
    (event, editor) => CommandManager.handleArrowUp(event, editor),
    moveToTitleWhenArrowUpDown
])
handlerMap.set('ArrowDown', [
    (event, editor) => LinkManager.menu.handleArrowDown(event, editor),
    (event, editor) => CommandManager.handleArrowDown(event, editor),
    moveSelectionWhenArrowDownDown
])
handlerMap.set('ctrl+z', [
    (event) => LinkManager.menu.handleCtrlZDown(event),
    undoWhenControlZKeyDown
])
handlerMap.set('ctrl+y', [
    redoWhenControlYKeyDown
])
handlerMap.set('Backspace', [
    // moveSelectionWhenBackspaceDown,
    // handleBackspaceInList
])
handlerMap.set('Tab', [
    (event, editor) => LinkManager.menu.handleEnterAndTab(event, editor),
    (event, editor) => CommandManager.handleEnterAndTab(event, editor),
    handleTabInCode,
    handleTabInList
])
handlerMap.set('shift+Tab', [
    handleShiftTabInList
])
handlerMap.set('Enter', [
    (event, editor) => LinkManager.menu.handleEnterAndTab(event, editor),
    (event, editor) => CommandManager.handleEnterAndTab(event, editor),
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
    (event, editor) => EditorManager.lastPressedKey = event.key
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
    }
    keys.push(event.key)
    const eventKey = keys.join('+')
    console.log(eventKey)
    const handlers = handlerMap.get(eventKey)
    console.log(handlers)
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
