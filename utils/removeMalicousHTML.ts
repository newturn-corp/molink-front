export const removeMaliciousHTML = (text: string) => {
    return text.replace(/<\/?[^>]+(>|$)/g, '')
}
