export const maintainBottomMargin = () => {
    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()

    if (rect.top > globalThis.document.body.clientHeight * 0.8) {
        const contentContainer = globalThis.document.getElementsByClassName('content-container')[0]
        contentContainer.scrollTop = contentContainer.scrollHeight
    }
    return false
}
