const canvas = globalThis.document.createElement('canvas')
globalThis.context = canvas.getContext('2d')
globalThis.context.font = getComputedStyle(document.body).font

export const getTextWidth = (context: CanvasRenderingContext2D = globalThis.context, text: string) => {
    return context.measureText(text).width
}

// 문자열을 렌더링 할 때, 주어진 길이가 어느 문자에 해당하는지 찾는 함수
export const getTextIndexByLength = (context: CanvasRenderingContext2D, text: string, length: number) => {
    console.log(text)
    console.log(length)
    const textLength = getTextWidth(context, text)
    if (textLength <= length) {
        return text.length
    }

    // 이진 탐색으로 가장 가까운 인덱스를 찾는다.
    // let textIndex = Math.round(text.length / 2)
    // let standard = text.length
    // let minNewLineCursorPosition = textIndex
    // let minDiff = 100000
    // for (let i = 0; i < 20; i++) {
    //     const width = getTextWidth(context, text.slice(0, textIndex))
    //     const diff = Math.abs(length - width)

    //     // minDiff가 값을 바꿈으로써 minDiff값이 바뀌지 않는다면 더 변경할 필요가 없음
    //     if (diff > minDiff) {
    //         break
    //     }
    //     // diff 값 갱신
    //     minNewLineCursorPosition = textIndex
    //     minDiff = diff
    //     console.log(diff)

    //     const standardDiff = Math.round(Math.abs(standard - textIndex) / 2)
    //     standard = textIndex
    //     if (length - width > 0) {
    //         textIndex += standardDiff
    //     } else {
    //         textIndex -= standardDiff
    //     }
    // }
    let low = 0
    let high = text.length
    let mid

    for (let i = 0; i < 5; i++) {
        mid = low + Math.floor((high - low) / 2)
        // console.log('low' + low)
        // console.log('mid' + mid)
        // console.log('high' + high)
        const width = getTextWidth(context, text.slice(0, mid))
        const diff = Math.abs(length - width)
        // if (diff < 5) {
        //     break
        // }
        if (high === low || diff < 5) {
            return mid
        }

        if (length - width > 0) {
            low = mid
        } else {
            high = mid
        }
    }
    return mid
}

// 한 텍스트에서 다음 텍스트로 넘어갈 때, 적절한 커서 위치를 반환하는 함수
export const getCursorPosition = (context: CanvasRenderingContext2D, lastLine: string, lastCursorPosition: number, newLine: string, viewportWidth: number) => {
    // 다음과 같은 경우를 분기로 구한다.
    // 1. 새 라인이 멀티 라인인 경우
    // 1. 기존 라인의 길이를 구한다.
    // viewportWidth -= 10
    const lastLineWidth = getTextWidth(context, lastLine.slice(0, lastCursorPosition))
    const newLineWidth = getTextWidth(context, newLine)
    console.log('viewportWidth' + viewportWidth)
    console.log('lastLineWidth' + lastLineWidth)
    console.log('newLineWidth' + newLineWidth)

    // 1. 기존 라인이 단일 라인인 경우
    // - 길이가 viewport를 넘치는 경우, 잘라낸다.
    if (lastLineWidth < viewportWidth) {
        // 1-1. 새 라인이 단일 라인인 경우
        if (newLineWidth < viewportWidth) {
            console.log('기단새단')
            return getTextIndexByLength(context, newLine, lastLineWidth)
        } else {
            console.log('기단새멀')
            // 1-2. 새 라인이 멀티 라인인 경우
            const lineCount = Math.ceil(newLineWidth / viewportWidth)
            // 마지막으로 개행된 라인 시작점의 글자 위치를 구한다.
            const startIndex = getTextIndexByLength(context, newLine, (lineCount - 1) * viewportWidth)
            console.log(newLine.slice(startIndex))
            return getTextIndexByLength(context, newLine.slice(startIndex), lastLineWidth) + startIndex
        }
    } else {
        console.log('기멀새멀단')
        // 2. 기존 라인이 멀티 라인인 경우
        return getTextIndexByLength(context, newLine, lastLineWidth % viewportWidth)
    }
}
