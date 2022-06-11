import { makeAutoObservable } from 'mobx'
import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import { Element, Node, Path, Range, Transforms } from 'slate'
import React from 'react'
import FileManager from '../../Editing/FileManager'
import { AvailCodeLanguage, CodeElement } from '../../../Types/slate/CustomElement'
import EditorPage from './EditorPage'
import UserManager from '../../global/User/UserManager'

export class EditorToolbar {
    enable: boolean = false
    isOpen: boolean = true
    showMobileToolbar: boolean = false

    constructor () {
        makeAutoObservable(this)
    }

    tryEnable () {
        if (UserManager.isUserAuthorized && !UserManager.setting.editorSetting.toolbarEnable) {
            return
        }
        this.enable = true
    }

    disable () {
        this.enable = false
    }

    async open () {
        this.isOpen = true
        await EventManager.issueEvent(Event.ToolbarOnOffChange, { isToolbarOpen: true })
        await EventManager.issueEvent(Event.MobileToolbarOnOffChange, { isToolbarOpen: true })
    }

    async close () {
        this.isOpen = false
        await EventManager.issueEvent(Event.ToolbarOnOffChange, { isToolbarOpen: false })
        await EventManager.issueEvent(Event.MobileToolbarOnOffChange, { isToolbarOpen: false })
    }

    handleEditorChange () {
        const editor = EditorPage.editor.slateEditor
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
        Transforms.insertNodes(EditorPage.editor.slateEditor, newProperties)
    }
}
