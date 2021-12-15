import { ReactEditor } from 'slate-react'
import {
    BaseEditor, Descendant
} from 'slate'

export type ParagraphElement = {
  type: string
  children: CustomText[]
}

export type TextElement = {
  type: string
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  children: Descendant[]
}

export type CustomElement = ParagraphElement | TextElement | BulletedListElement

export type FormattedText = { type: string, text: string; bold?: true; codehighlight?: true }

export type CustomText = FormattedText

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor
      Element: CustomElement
      Text: CustomText
    }
}
