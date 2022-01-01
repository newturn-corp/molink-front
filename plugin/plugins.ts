import { EditorKeyDownHandler } from '../utils/slate'
import { onKeyDown as PlaceHolderOnKeyDown } from './PlaceHolderPlugin'

const onKeyDownHandlers: EditorKeyDownHandler[] = [PlaceHolderOnKeyDown]

const onKeyDown: EditorKeyDownHandler = (event, editor) => {
    onKeyDownHandlers.forEach(handler => {
        handler(event, editor)
    })
}

export { onKeyDown }
