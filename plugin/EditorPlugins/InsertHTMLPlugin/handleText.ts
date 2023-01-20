import { SourceType } from './InsertHTMLWhenInsertData'

export const handleText = (el: Element, sourceType: SourceType, fragmentCount: number) => {
    if (el.parentNode.nodeName === 'BODY' && sourceType === SourceType.Default) {
        return null
    }
    if (SourceType.Notion && !el.textContent) {
        return null
    }
    if (SourceType.Notion && fragmentCount === 0) {
        return null
    }
    return el.textContent
}
