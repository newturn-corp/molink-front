import React from 'react'
import FileManager from './FileManager'
import { makeAutoObservable } from 'mobx'
import { Editor as SlateEditor, Element as SlateElement, Element, Node, Path, Range, Transforms } from 'slate'
import EditorManager from '../Blog/EditorManager'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { AvailCodeLanguage, CodeElement } from '../../Types/slate/CustomElement'

class ToolbarManager {
    _showMobileToolbar: boolean = false
    get showMobileToolbar () {
        return this._showMobileToolbar
    }

    set showMobileToolbar (showMobileToolbar: boolean) {
        EventManager.issueEvent(Event.MobileToolbarOnOffChange, { isToolbarOpen: showMobileToolbar })
        this._showMobileToolbar = showMobileToolbar
    }

    constructor () {
        makeAutoObservable(this)
    }

    handleEditorChange () {
        const editor = EditorManager.slateEditor
        const { selection } = editor
        if (!selection || Range.isExpanded(selection)) {
            this.showMobileToolbar = false
            return
        }
        const parentPath = Path.parent(editor.selection.anchor.path)
        const currentNode = Node.get(editor, parentPath)
        if (!Element.isElement(currentNode) || (Element.isElement(currentNode) && currentNode.type !== 'text')) {
            this.showMobileToolbar = false
            return
        }
        this.showMobileToolbar = true
    }

    async insertImage (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await FileManager.getURLAndFileFromInputEvent(event)
        await FileManager.insertImage(url, file)
    }

    async insertVideo (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await FileManager.getURLAndFileFromInputEvent(event)
        await FileManager.insertVideo(url, file)
    }

    async insertFile (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await FileManager.getURLAndFileFromInputEvent(event)
        await FileManager.insertFile(url, file)
    }

    async insertCode () {
        const newProperties: CodeElement = {
            type: 'code',
            language: AvailCodeLanguage.Javascript,
            children: [{
                text: '',
                codeLanguage: AvailCodeLanguage.Javascript
            }]
        }
        Transforms.insertNodes(EditorManager.slateEditor, newProperties)
    }
}
export default new ToolbarManager()
