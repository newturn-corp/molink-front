export type EmptyText = {
    text: string
}

export type FormattedText = {
    bold?: boolean
    italic?: boolean
    code?: boolean
    underlined?: boolean
    codehighlight?: boolean
    text: string
}

export type CustomText = FormattedText & EmptyText
