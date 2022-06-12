import StyleManager from '../../manager/global/Style/StyleManager'

export const maintainBottomMargin = () => {
    const domSelection = window.getSelection()
    if (domSelection.rangeCount === 0) {
        return false
    }
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    const contentContainer = globalThis.document.getElementById('content-body')
    const cursorTop = rect.top - StyleManager.contentStyle.body.top - 56
    const clientHeight = contentContainer.clientHeight
    // const aaa = contentContainer.scrollHeight - contentContainer.scrollTop
    // console.log(rect.top - StyleManager.contentStyle.body.top - 56)
    // console.log(StyleManager.contentStyle.body.height * 0.8)
    if (cursorTop < clientHeight * 0.2) {
        contentContainer.scrollTop -= (clientHeight * 0.2 - cursorTop)
    } else if (cursorTop > clientHeight * 0.8) {
        contentContainer.scrollTop += (cursorTop - clientHeight * 0.8)
    }
    return false
}
