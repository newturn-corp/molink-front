import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'
import { handleKeyDown as ListKeyDownHandler } from './ListPlugin'
import HotKeyManager from '../../manager/Editing/HotKeyManager'
import MentionManager from '../../manager/Editing/MentionManager'
import CommandManager from '../../manager/Editing/Command/CommandManager'

const keyDownHandlers = [
    PlaceHolderOnKeyDown,
    ListKeyDownHandler,
    (event, editor) => HotKeyManager.handleKeyDown(event, editor),
    (event, editor) => MentionManager.handleKeyDown(event, editor),
    (event, editor) => CommandManager.handleKeyDown(event, editor)
]

export const handleKeyDown = (event, editor) => {
    keyDownHandlers.forEach(handler => {
        handler(event, editor)
    })
}
