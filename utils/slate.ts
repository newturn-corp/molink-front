import { ReactEditor } from 'slate-react'
import {
    BaseEditor, Descendant, Editor
} from 'slate'
import { HistoryEditor } from 'slate-history'
import React from 'react'

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

export type OrderedListElement = {
  type: 'ol-list'
  children: Descendant[]
}

export type BulletedListElement = {
  type: 'ul-list'
  children: Descendant[]
}

export enum ImageFloatOption {
  Left,
  Center,
  Right
}

export type ImageElement = {
  type: 'image'
  url: string
  width: number
  height: number
  isUploading: boolean
  floatOption: ImageFloatOption
  caption: string
  captionHeight: number
  children: EmptyText[]
}

export enum DividerType {
  Dot,
  ShortLine,
  FaintShortLine,
  LongLine,
  FaintLongLine
}

export type DividerElement = {
  type: 'divider'
  dividerType: DividerType
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

export type OrderedListItemElement = {
  type: 'ordered-list-item'
  children: CustomText[]
}

export type DocumentElement = {
  type: 'document',
  documentId: string,
  children: EmptyText[]
}

export type CheckListItemElement = {
  type: 'check-list-item',
  checked: boolean,
  children: CustomText[]
}

export type EditorKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>, editor: Editor) => void

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type CustomElement =
TextElement |
BulletedListElement |
ImageElement |
MentionElement |
TitleElement |
ListItemElement |
LinkElement |
OrderedListElement |
OrderedListItemElement |
DividerElement |
DocumentElement |
CheckListItemElement

export type FormattedText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  underlined?: boolean
  text: string
}

export type CustomText = FormattedText & EmptyText

type OnlineEditor = {
  connect: Function
}

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor & HistoryEditor & OnlineEditor
      Element: CustomElement
      Text: CustomText
    }
}
