import { Transforms } from 'slate'
import EditorManager from '../../manager/Blog/EditorManager'

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

export const moveSelectionWhenArrowUpDown = (event) => {
    // event.preventDefault()
    // console.log('up')
    // Transforms.move(EditorManager.slateEditor, { unit: 'line', reverse: true })
    return true
}

export const moveSelectionWhenArrowDownDown = (event) => {
    event.preventDefault()
    console.log('down')
    Transforms.move(EditorManager.slateEditor, { unit: 'line' })
    return true
}
