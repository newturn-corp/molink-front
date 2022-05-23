import { Descendant } from 'slate'
import { CustomText } from './CustomText'

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

export type QuoteElement = {
    type: 'block-quote'
}

export type TextElement = {
    type: 'text',
    category: TextCategory,
    children: CustomText[],
    align?: 'left' | 'right' | 'center' | 'justify'
  }

export type OrderedListElement = {
    type: 'ol-list',
    data?: {
      start: number
    },
    children: Descendant[]
  }

export type BulletedListElement = {
    type: 'ul-list'
    children: Descendant[]
  }

export enum FloatOption {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export type SlateImageElementType = {
    type: 'image'
    url: string
    width: number
    height: number
    isUploading: boolean
    floatOption: FloatOption
    caption: string
    captionHeight: number
    size: number
    children: EmptyText[]
}

export type SlateVideoElementType = {
    type: 'video'
    url: string
    isUploading: boolean
    name: string
    children: EmptyText[]
    floatOption: FloatOption
    width: number
    height: number
    caption: string
    captionHeight: number,
    size: number
}

export type SlateFileElementType = {
    type: 'file'
    url: string
    isUploading: boolean
    name: string
    children: EmptyText[]
    size: number,
    fileType: string
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

export type CodeElement = {
    type: 'code',
    children: CustomText[]
}

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type YoutubeElement = {
    type: 'youtube'
    videoId: string
    children: Descendant[]
}

export type BookmarkElementType = {
    type: 'bookmark',
    url: string,
    children: EmptyText[]
}

export type CalloutElementType = {
    type: 'callout',
    icon: string,
    children: CustomText[]
}

export type CustomElement =
TextElement |
BulletedListElement |
SlateImageElementType |
MentionElement |
TitleElement |
ListItemElement |
LinkElement |
OrderedListElement |
OrderedListItemElement |
DividerElement |
DocumentElement |
CheckListItemElement |
CodeElement |
YoutubeElement |
QuoteElement |
SlateVideoElementType |
SlateFileElementType |
BookmarkElementType |
CalloutElementType
