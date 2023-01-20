import { Transforms } from 'slate'
import { Deserializer } from './Deserializer'

export enum SourceType {
    Default,
    Notion
}

export const getSourceTypeFromData = (data) => {
    const types = data.types
    for (const type of types) {
        if (type.includes('notion')) {
            return SourceType.Notion
        }
    }
    return SourceType.Default
}

export const insertHTMLWhenInsertData = (editor, data) => {
    console.log(data)
    const html = data.getData('text/html')

    if (html) {
        const deserializer = new Deserializer(getSourceTypeFromData(data))
        const fragment = deserializer.getFragmentFromHTML(html)
        Transforms.insertFragment(editor, fragment)
        return true
    }
    return false
}
