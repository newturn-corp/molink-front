import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseRange, Editor, Element, Range, Transforms } from 'slate'
import Command from '../domain/Command'
import { TextCategory } from '../utils/slate'

// /(슬래시)로 수행하는 명령을 맡아 처리하는 매니저
class CommandManager {
    target: BaseRange = null
    search: string = ''
    index: number = 0
    searchedCommands: Command[] = []
    commandsList = [
        new Command('제목1', '큰 사이즈의 제목', './head-1.png'),
        new Command('제목2', '중간 사이즈의 제목', './head-2.png'),
        new Command('제목3', '작은 사이즈의 제목', './head-3.png')
    ]

    constructor () {
        makeAutoObservable(this)
    }

    insertNodeByCommand (editor: Editor, command: Command) {
        let node: Element
        switch (command.name) {
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
        Transforms.insertNodes(editor, node)
        // Transforms.move(editor)
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
                this.searchedCommands = this.commandsList.filter(command =>
                    command.name.startsWith(this.search.toLowerCase())
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
                this.target = null
                break
            }
        }
    }
}

export default new CommandManager()
