import { ReactEditor } from 'slate-react'
import {
    BaseEditor, Descendant
} from 'slate'
import { HistoryEditor } from 'slate-history'

export type EmptyText = {
  text: string
}

export enum TextCategory {
    Head1 = 'head1',
    Head2 = 'head2',
    Head3 = 'head3',
    Content1 = 'content1',
    Content2 = 'content2',
    Content3 = 'content3'
}

export type TextElement = {
  type: 'text',
  category: TextCategory,
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'ul_list'
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

export type ListItemElement = {
  type: 'list-item'
  children: CustomText[]
}

export type CustomElement =
TextElement | BulletedListElement | ImageElement | MentionElement | TitleElement |ListItemElement

export type FormattedText = { text: string; bold?: true; codehighlight?: true }

export type CustomText = FormattedText | EmptyText

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor & HistoryEditor
      Element: CustomElement
      Text: CustomText
    }
}
