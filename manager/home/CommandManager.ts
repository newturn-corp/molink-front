import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseRange, Editor, Element, Range, Transforms } from 'slate'
import { TextCategory, TextElement } from '../../utils/slate'

class CommandManager {
    target: BaseRange = null
    search: string = ''
    index: number = 0
    searchedCommands: string[] = []
    commandsList = [
        '제목1',
        '제목2',
        '제목3'
    ]

    constructor () {
        makeAutoObservable(this)
    }

    insertNodeByCommand (editor: Editor, command: string) {
        let node: Element
        switch (command) {
        case '제목1':
            node = {
                type: 'text',
                category: TextCategory.Head1,
                children: [{ text: '' }]
            }
            break
        case '제목2':
            node = {
                type: 'text',
                category: TextCategory.Head2,
                children: [{ text: '' }]
            }
            break
        case '제목3':
            node = {
                type: 'text',
                category: TextCategory.Head3,
                children: [{ text: '' }]
            }
            break
        case '내용1':
            node = {
                type: 'text',
                category: TextCategory.Content1,
                children: [{ text: '' }]
            }
            break
        case '내용2':
            node = {
                type: 'text',
                category: TextCategory.Content2,
                children: [{ text: '' }]
            }
            break
        case '내용3':
            node = {
                type: 'text',
                category: TextCategory.Content3,
                children: [{ text: '' }]
            }
            break
        }
        console.log(node)
        Transforms.insertNodes(editor, node)
        Transforms.move(editor)
    }

    onChange (editor: Editor) {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection)
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const before = wordBefore && Editor.before(editor, wordBefore)
            const beforeRange = before && Editor.range(editor, before, start)
            const beforeText = beforeRange && Editor.string(editor, beforeRange)
            const beforeMatch = beforeText && beforeText.match(/^\//)
            const after = Editor.after(editor, start)
            const afterRange = Editor.range(editor, start, after)
            const afterText = Editor.string(editor, afterRange)
            const afterMatch = afterText.match(/^(\s|$)/)

            if (beforeMatch && afterMatch) {
                this.target = beforeRange
                const searchResult = beforeText.match(/^\/(\w+)$/)
                if (!searchResult) {
                    this.search = ''
                } else {
                    this.search = searchResult[1]
                }
                this.searchedCommands = this.commandsList.filter(character =>
                    character.toLowerCase().startsWith(this.search.toLowerCase())
                ).slice(0, 10)
                this.index = 0
                return
            }
        }
        this.target = null
    }

    onKeyDown (event: React.KeyboardEvent, editor: Editor) {
        if (this.target) {
            switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                this.index = this.index >= this.searchedCommands.length - 1 ? 0 : this.index + 1
                break
            case 'ArrowUp':
                event.preventDefault()
                this.index = this.index <= 0 ? this.searchedCommands.length - 1 : this.index - 1
                break
            case 'Tab':
            case 'Enter':
                event.preventDefault()
                Transforms.select(editor, toJS(this.target))
                this.insertNodeByCommand(editor, this.searchedCommands[this.index])
                this.target = null
                break
            case 'Escape':
                event.preventDefault()
                console.log('호출')
                this.target = null
                break
            }
        }
    }
}

export default new CommandManager()
