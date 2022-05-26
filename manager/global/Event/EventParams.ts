import { Descendant, Editor } from 'slate'
import React from 'react'

export type NewEditorOpenParam = {
    editor: Editor
}

export type EditorChangeParam = {
    value: Descendant[],
    editor: Editor
}

export type ChangeDocumentTitleInFileSystemParam = {
    document: Document
    title: string
}
export type OnEditorKeyDownParam = {
    rawEvent: React.KeyboardEvent<Element>
    editor: Editor
}
export type DocumentChildrenOpenParam = {
    document: Document,
    childrenOpen: boolean
}
export type OpenDocumentParam = {
    document: Document
}
export type ChangeDocumentTitleInEditorParam = {
    document: Document,
    title: string
}
export type UserAuthorizationParam = {
    result: boolean
}
export type HierarchyOnOffChangeParam = {
    onOff: boolean
}
export type HierarchyWidthChangeParam = {
    width: number
}
export type ToolbarOnOffChangeParam = {
    isToolbarOpen: boolean
}
export type FileUploadParam = {
    size: number
}
export type PageFileUsageChangeParam = {
    usage: number
}
export type LockPageParam = {
    isLocked: boolean
}

export type EventParam = {} | OnEditorKeyDownParam | DocumentChildrenOpenParam | OpenDocumentParam | ChangeDocumentTitleInEditorParam | UserAuthorizationParam | ChangeDocumentTitleInFileSystemParam | NewEditorOpenParam | EditorChangeParam
| HierarchyOnOffChangeParam | HierarchyWidthChangeParam | ToolbarOnOffChangeParam | FileUploadParam | PageFileUsageChangeParam | LockPageParam
