import { ReactEditor } from 'slate-react'
import {
    BaseEditor
} from 'slate'
import Block from '../domain/Block'
import BlockNoLeaf from '../domain/BlockNoLeaf'

export type ParagraphElement = {
  children: CustomText[]
}

export type TextElement = {
  children: CustomText[]
}

export type CustomElement = ParagraphElement | TextElement

export type FormattedText = { text: string; bold?: true }

export type CustomText = FormattedText

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor
      Element: CustomElement
      Text: CustomText
    }
}
