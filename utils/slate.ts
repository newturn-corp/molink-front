import { ReactEditor } from 'slate-react'
import {
    BaseEditor, Descendant
} from 'slate'

export type EmptyText = {
  text: string
}

export type ParagraphElement = {
  type: string
  children: CustomText[]
}

export type TextElement = {
  type: string
  children: CustomText[]
}

export type BulletedListElement = {
  type: string
  children: Descendant[]
}

export type ImageElement = {
  type: 'image'
  url: string
  children: EmptyText[]
}

export type TitleElement = {
  type: 'title'
  children: Descendant[]
}

export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomText[]
}

export type CustomElement =
ParagraphElement | TextElement | BulletedListElement | ImageElement | MentionElement

export type FormattedText = { text: string; bold?: true; codehighlight?: true }

export type CustomText = FormattedText

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor
      Element: CustomElement
      Text: CustomText
    }
}
