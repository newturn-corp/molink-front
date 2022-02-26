export const undoWhenControlZKeyDown = (event, editor) => {
    event.preventDefault()
    editor.undo()
    return true
}

export const redoWhenControlYKeyDown = (event, editor) => {
    event.preventDefault()
    editor.redo()
    return true
}
