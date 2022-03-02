import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'
import {
    handleBackspaceInList, handleEnterInList,
    handleShiftTabInList,
    handleTabInList
} from './ListPlugin'
import { handleEnterInCode, handleShiftEnterInCode, handleTabInCode } from './CodeHandleKeyDownPlugin'
import CommandManager from '../../manager/Editing/Command/CommandManager'
import { moveSelectionWhenArrowLeftDown, moveSelectionWhenArrowRightDown } from './ArrowKeyMovementPlugin'
import { redoWhenControlYKeyDown, undoWhenControlZKeyDown } from './UndoPlugin'
import { insertNewLineWhenShiftEnterKeyDown } from './InsertNewLinePlugin'

const handlerMap = new Map()
handlerMap.set('ArrowLeft', [
    moveSelectionWhenArrowLeftDown
])
handlerMap.set('ArrowRight', [
    moveSelectionWhenArrowRightDown
])
handlerMap.set('ArrowUp', [
    (event, editor) => CommandManager.handleArrowUp(event, editor)
])
handlerMap.set('ArrowDown', [
    (event, editor) => CommandManager.handleArrowDown(event, editor)
])
handlerMap.set('ctrl+z', [
    undoWhenControlZKeyDown
])
handlerMap.set('ctrl+y', [
    redoWhenControlYKeyDown
])
handlerMap.set('Backspace', [
    handleBackspaceInList
])
handlerMap.set('Tab', [
    (event, editor) => CommandManager.handleEnterAndTab(event, editor),
    handleTabInCode,
    handleTabInList
])
handlerMap.set('shift+Tab', [
    handleShiftTabInList
])
handlerMap.set('Enter', [
    (event, editor) => CommandManager.handleEnterAndTab(event, editor),
    handleEnterInList,
    handleEnterInCode
])
handlerMap.set('shift+Enter', [
    handleShiftEnterInCode,
    insertNewLineWhenShiftEnterKeyDown
])
handlerMap.set('Escape', [
    (event, editor) => CommandManager.handleEscape(event, editor)
])

const generalKeyDownHandlers = [
    PlaceHolderOnKeyDown
]

export const handleKeyDown = async (event, editor) => {
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
    const handlers = handlerMap.get(eventKey)
    if (!handlers) {
        return
    }
    for (const handler of handlers) {
        const isHandled = await handler(event, editor)
        if (isHandled) {
            return
        }
    }
}
