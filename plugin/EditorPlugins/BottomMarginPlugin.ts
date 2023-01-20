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
    const marginValue = 0.4
    if (cursorTop < clientHeight * marginValue) {
        contentContainer.scrollTop -= (clientHeight * marginValue - cursorTop)
    } else if (cursorTop > clientHeight * (1 - marginValue)) {
        contentContainer.scrollTop += (cursorTop - clientHeight * (1 - marginValue))
    }
    return false
}
