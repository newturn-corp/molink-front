export const numberToByteExpression = (size: number, fractionDigits: number = 1) => {
    if (size < 1024) {
        return `${size}B`
    } else if (size < 1048576) {
        return `${(size / 1024).toFixed(fractionDigits)}KB`
    } else if (size < 1073741824) {
        return `${(size / 1048576).toFixed(fractionDigits)}MB`
    } else {
        return `${(size / 1073741824).toFixed(fractionDigits)}GB`
    }
}
