export const getFileSizeString = (size: number) => {
    if (size < 1024) {
        return `${size}Byte`
    } else if (size < 10485760) {
        return `${(size / 1024).toFixed(1)}KB`
    } else if (size < 10737418240) {
        return `${(size / 1048576).toFixed(1)}MB`
    } else {
        return `${(size / 1073741824).toFixed(1)}GB`
    }
}
