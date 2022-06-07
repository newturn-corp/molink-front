import {
    Editor as SlateEditor,
    Editor,
    Element as SlateElement,
    Element,
    Text,
    Transforms
} from 'slate'
import { makeAutoObservable } from 'mobx'
import { TextElement } from '../../Types/slate/CustomElement'
import { ListEditor, ListElement, ListTransforms } from '../../plugin'
import { ReactEditor } from 'slate-react'
import EditorPage from '../Blog/Editor/EditorPage'

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
        const slateEditor = EditorPage.editor.slateEditor
        if (!slateEditor) {
            return false
        }
        try {
            const [match] = Editor.nodes(slateEditor, {
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
        const slateEditor = EditorPage.editor.slateEditor
        if (!slateEditor) {
            return false
        }
        const { selection } = slateEditor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(slateEditor, {
                at: Editor.unhangRange(slateEditor, selection),
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
        const slateEditor = EditorPage.editor.slateEditor
        if (isActive) {
            SlateEditor.removeMark(slateEditor, format)
        } else {
            SlateEditor.addMark(slateEditor, format, true)
        }
        ReactEditor.focus(slateEditor)
        this.clear()
    }

    toggleAlign (format) {
        const slateEditor = EditorPage.editor.slateEditor
        const editor = slateEditor
        const isActive = this.isAlignActive(format)
        const newProperties: Partial<Element> = {
            align: isActive ? undefined : format
        }
        Transforms.setNodes<Element>(editor, newProperties)
    }

    toggleList (list: List) {
        const editor = EditorPage.editor.slateEditor
        ReactEditor.focus(editor)
        const isActive = this.listMap.get(list)
        if (isActive) {
            ListTransforms.unwrapList(editor)
            const newProperties: Partial<SlateElement> = {
                type: 'text'
            }
            Transforms.setNodes(editor, newProperties)
        } else {
            if (ListEditor.isSelectionInList(editor)) {
                const newProperties: Partial<SlateElement> = {
                    type: list as any
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => ListElement.isList(n)
                })
            } else {
                ListTransforms.wrapInList(editor, list)
            }

            if (list === List.Check) {
                const newProperties: Partial<SlateElement> = {
                    type: 'check-list-item',
                    checked: false
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n) && n.type === 'list-item'
                })
            } else {
                const newProperties: Partial<SlateElement> = {
                    type: 'list-item'
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n) && (n.type === 'list-item' || n.type === 'check-list-item')
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
        const slateEditor = EditorPage.editor.slateEditor
        if (slateEditor.selection) {
            const list = ListEditor.getListForItem(slateEditor, slateEditor.selection.anchor.path)
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
