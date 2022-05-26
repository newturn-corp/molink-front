import {
    Editor as SlateEditor,
    Editor,
    Element as SlateElement,
    Element,
    Location,
    Range,
    Text,
    Transforms
} from 'slate'
import EditorManager from '../Blog/EditorManager'
import { makeAutoObservable } from 'mobx'
import { toJSON } from 'yaml/util'
import { TextElement } from '../../Types/slate/CustomElement'
import { ListEditor, ListTransforms } from '../../plugin'
import { ReactEditor } from 'slate-react'

export enum Format {
    Bold = 'bold',
    Italic = 'italic',
    Underline = 'underlined'
}

export enum Align {
    Left = 'left',
    Right = 'right',
    Center = 'center',
    Justify = 'justify'
}

export enum List {
    Dot = 'ul-list',
    Number = 'ol-list',
    Check = 'check-list'
}

class FormattingManager {
    formatActiveMap: Map<Format, boolean>
    alignMap: Map<Align, boolean>
    listMap: Map<List, boolean>

    constructor () {
        this.formatActiveMap = new Map<Format, boolean>()
        this.alignMap = new Map<Align, boolean>()
        this.listMap = new Map<List, boolean>()
        this.clear()
        makeAutoObservable(this)
    }

    isFormatActive (format: Format) {
        try {
            const [match] = Editor.nodes(EditorManager.slateEditor, {
                match: n => n[format] === true,
                universal: true
            })
            return !!match
        } catch {
            // eslint-disable-next-line no-unsafe-finally
            return false
        }
    }

    isAlignActive (align) {
        const editor = EditorManager.slateEditor
        const { selection } = editor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n =>
                    !Editor.isEditor(n) &&
                    Element.isElement(n) &&
                    (n as TextElement).align === align
            })
        )

        return !!match
    }

    toggleFormat (format: Format) {
        const isActive = this.formatActiveMap.get(format)
        const [match] = Editor.nodes(EditorManager.slateEditor, {
            at: EditorManager.slateEditor.selection,
            match: Text.isText
        })
        Transforms.setNodes(
            EditorManager.slateEditor,
            {
                [format]: isActive ? null : true
            },
            {
                match: Text.isText,
                split: true
            }
        )
        this.clear()
    }

    toggleAlign (format) {
        const editor = EditorManager.slateEditor
        const isActive = this.isAlignActive(format)
        const newProperties: Partial<Element> = {
            align: isActive ? undefined : format
        }
        Transforms.setNodes<Element>(editor, newProperties)
    }

    toggleList (list: List) {
        const editor = EditorManager.slateEditor
        ReactEditor.focus(editor)
        const isActive = this.listMap.get(list)
        if (isActive) {
            ListTransforms.unwrapList(editor)
            const newProperties: Partial<SlateElement> = {
                type: 'text'
            }
            Transforms.setNodes(editor, newProperties)
        } else {
            ListTransforms.wrapInList(editor, list)
            if (list === List.Check) {
                const newProperties: Partial<SlateElement> = {
                    type: 'check-list-item',
                    checked: false
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n) && n.type === 'list-item'
                })
            }
        }
    }

    clear () {
        this.formatActiveMap.set(Format.Bold, false)
        this.formatActiveMap.set(Format.Italic, false)
        this.formatActiveMap.set(Format.Underline, false)
        this.alignMap.set(Align.Left, false)
        this.alignMap.set(Align.Right, false)
        this.alignMap.set(Align.Center, false)
        this.alignMap.set(Align.Justify, false)
        this.listMap.set(List.Dot, false)
        this.listMap.set(List.Number, false)
        this.listMap.set(List.Check, false)
    }

    handleEditorChange () {
        this.formatActiveMap.set(Format.Bold, this.isFormatActive(Format.Bold))
        this.formatActiveMap.set(Format.Italic, this.isFormatActive(Format.Italic))
        this.formatActiveMap.set(Format.Underline, this.isFormatActive(Format.Underline))
        this.alignMap.set(Align.Left, this.isAlignActive(Align.Left))
        this.alignMap.set(Align.Center, this.isAlignActive(Align.Center))
        this.alignMap.set(Align.Right, this.isAlignActive(Align.Right))
        this.alignMap.set(Align.Justify, this.isAlignActive(Align.Justify))
        this.listMap.set(List.Dot, false)
        this.listMap.set(List.Number, false)
        this.listMap.set(List.Check, false)
        if (EditorManager.slateEditor.selection) {
            const list = ListEditor.getListForItem(EditorManager.slateEditor, EditorManager.slateEditor.selection.anchor.path)
            if (list) {
                const [node] = list
                if (node.type === 'ul-list') {
                    this.listMap.set(List.Dot, true)
                } else if (node.type === 'ol-list') {
                    this.listMap.set(List.Number, true)
                } else if (node.type === 'check-list') {
                    this.listMap.set(List.Check, true)
                }
            }
        }
    }
}
export default new FormattingManager()
