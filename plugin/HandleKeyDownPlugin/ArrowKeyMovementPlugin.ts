import { Transforms } from 'slate'
import EditorManager from '../../manager/Home/EditorManager'

export const moveSelectionWhenArrowLeftDown = (event) => {
    event.preventDefault()
    Transforms.move(EditorManager.slateEditor, {
        unit: 'offset',
        reverse: true
    })
    return true
}

export const moveSelectionWhenArrowRightDown = (event) => {
    event.preventDefault()
    Transforms.move(EditorManager.slateEditor, { unit: 'offset' })
    return true
}
