import { AvailCodeLanguage } from './CustomElement'

export type EmptyText = {
    text: string
}

export type FormattedText = {
    bold?: boolean
    italic?: boolean
    code?: boolean
    underlined?: boolean
    codehighlight?: boolean
    codeLanguage?: AvailCodeLanguage
    text: string
}

export type CustomText = FormattedText & EmptyText
