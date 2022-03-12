import { Editor, Node, NodeEntry, NodeMatch } from 'slate'

export type InsertBreakHandler = (editor: Editor) => boolean

export type DeleteBackwardHandler = (editor: Editor, unit: 'character' | 'word' | 'line' | 'block') => boolean

export type NormalizeNodeHandler = (editor: Editor, entry: NodeEntry<Node>) => boolean

export type InsertTextHandler = (editor: Editor, text: string) => boolean

export type InsertDataHandler = (editor: Editor, data: DataTransfer) => boolean
