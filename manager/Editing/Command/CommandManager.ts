import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseRange, Editor, Element, Node, Path, Range, Transforms } from 'slate'
import { DividerType, TextCategory } from '../../../Types/slate/CustomElement'
import { ListTransforms } from '../../../plugin/GlobalPlugins/ListPlugin'
import Command from './Command'
import CommandGroup from './CommandGroup'
import EditorManager from '../../Blog/EditorManager'

// /(슬래시)로 수행하는 명령을 맡아 처리하는 매니저
class CommandManager {
    target: BaseRange = null
    search: string = ''
    index: number = 0
    _searchedCommandCount: number = 0
    isCommandDrawerOpen: boolean = false

    _searchedCommandGroupList: CommandGroup[] = []
    get searchedCommandGroupList () {
        return toJS(this._searchedCommandGroupList)
    }

    commandGroupList = [
        new CommandGroup(
            '제목',
            [new Command('제목1', '상위 레벨 제목에 사용', '/image/editor/command/head1.png'),
                new Command('제목2', '핵심 세션에 사용', '/image/editor/command/head2.png'),
                new Command('제목3', '하위 세션에 사용', '/image/editor/command/head3.png')]
        ),
        new CommandGroup(
            '구분선',
            [
                new Command('구분선-기본', '콘텐츠 구분선', '/image/editor/command/divider-default.png'),
                new Command('구분선-흐릿한', '콘텐츠 구분선', '/image/editor/command/divider-faint.png'),
                new Command('구분선-짦은', '콘텐츠 구분선', '/image/editor/command/divider-short.png'),
                new Command('구분선-짦고 흐릿한', '콘텐츠 구분선', '/image/editor/command/divider-faint-short.png'),
                new Command('구분선-점', '콘텐츠 구분선', '/image/editor/command/divider-dot.png')
            ]
        ),
        new CommandGroup(
            '목록',
            [
                new Command('순서없는목록', '순서 없는 목록', '/image/editor/command/bullet-list.png'),
                new Command('숫자목록', '숫자 목록', '/image/editor/command/ordered-list.png'),
                new Command('체크목록', '체크 목록', '/image/editor/command/check-list.png')
            ]
        ),
        new CommandGroup(
            '강조',
            [
                new Command('콜아웃', '강조하기 위한 한 줄', '/image/editor/command/bullet-list.png')
            ]
        )
        // ),
        // new CommandGroup(
        //     '추가',
        //     [
        //         new Command('페이지', '새로운 하위 페이지를 만듭니다.', '/image/editor/command/document.png')
        //     ]
        // )
    ]

    isSiblingVoid: boolean = false

    constructor () {
        makeAutoObservable(this)
    }

    isBlockActive (editor, format) {
        const { selection } = editor
        if (!selection) return false

        const [match] = Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) && Element.isElement(n) && n.type === format
        })

        return !!match
    }

    // 바로 위 노드가 void인 경우, 현재 node를 set하고
    // 일반적인 경우, insertNode를 함
    insertNode (editor: Editor, node: Element) {
        if (!editor.selection) {
            Transforms.select(editor, EditorManager.lastSelection)
        }
        const { selection } = editor
        const [start] = Range.edges(selection)
        const lineBefore = Editor.before(editor, start, { unit: 'word' })
        const beforeRange = lineBefore && Editor.range(editor, lineBefore, start)
        const beforeText = beforeRange && Editor.string(editor, beforeRange)
        if (beforeText && beforeText.length > 0) {
            Transforms.insertNodes(editor, node)
        } else {
            Transforms.delete(editor)
            Transforms.setNodes<Element>(editor, node, {
                match: n => Editor.isBlock(editor, n)
            })
        }
        // Transforms.select(editor, beforeRange)

        // const selectedNodePath = Path.parent(editor.selection.anchor.path)
        // const selectedNode = Node.get(editor, selectedNodePath)
        // if (!this.isSiblingVoid) {
        //     console.log('!this.isSiblingVoid')
        //     Transforms.delete(editor)
        //     Transforms.setNodes<Element>(editor, node, {
        //         match: n => Editor.isBlock(editor, n)
        //     })
        // } else {
        //     console.log('isSiblingVoid')
        //     Transforms.insertNodes(editor, node)
        // }
    }

    async insertNodeByCommand (editor: Editor, command: Command) {
        let node: Element
        switch (command.name) {
        case '제목1':
            node = {
                type: 'text',
                category: TextCategory.Head1,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '제목2':
            node = {
                type: 'text',
                category: TextCategory.Head2,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '제목3':
            node = {
                type: 'text',
                category: TextCategory.Head3,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '구분선-기본':
            node = {
                type: 'divider',
                dividerType: DividerType.LongLine,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '구분선-흐릿한':
            node = {
                type: 'divider',
                dividerType: DividerType.FaintLongLine,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '구분선-짦은':
            node = {
                type: 'divider',
                dividerType: DividerType.ShortLine,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '구분선-짦고 흐릿한':
            node = {
                type: 'divider',
                dividerType: DividerType.FaintShortLine,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '구분선-점':
            node = {
                type: 'divider',
                dividerType: DividerType.Dot,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '콜아웃':
            node = {
                type: 'callout',
                icon: '💡',
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case '순서없는목록':
            const unorderedRange = {
                anchor: {
                    offset: 0,
                    path: editor.selection.focus.path
                },
                focus: editor.selection.focus
            }
            Transforms.select(editor, unorderedRange)
            Transforms.delete(editor)
            ListTransforms.wrapInList(editor)
            break
        case '숫자목록':
            const orderedRange = {
                anchor: {
                    offset: 0,
                    path: editor.selection.focus.path
                },
                focus: editor.selection.focus
            }
            Transforms.select(editor, orderedRange)
            Transforms.delete(editor)
            ListTransforms.wrapInList(editor, 'ol-list')
            break
        case '체크목록':
            const checklistRange = {
                anchor: {
                    offset: 0,
                    path: editor.selection.focus.path
                },
                focus: editor.selection.focus
            }
            Transforms.select(editor, checklistRange)
            Transforms.delete(editor)
            const newProperties: Partial<Element> = {
                type: 'check-list-item',
                checked: false
            }
            Transforms.setNodes<Element>(editor, newProperties, {
                match: n => Editor.isBlock(editor, n)
            })
            ListTransforms.wrapInList(editor, 'check-list')
            break
        // case '페이지':
        //     if (!ContentManager.openedDocument) {
        //         return
        //     }
        //     const document = await Page.create(ContentManager.openedDocument, ContentManager.openedDocument.directoryInfo.children.length)
        //     node = {
        //         type: 'document',
        //         documentId: document.meta.id,
        //         children: [{ text: '' }]
        //     }
        //     EventManager.addDisposableEventListener(Event.LoadingContent, ({ editor }: { editor: EditorManager }) => {
        //         Transforms.select(editor, [0, 0])
        //     }, 1)
        //     EventManager.addDisposableEventListener(Event.EditorChange, () => {
        //         RoutingManager.moveTo(Page.Index, `?id=${document.meta.id}`)
        //     }, 1)
        //     this.insertNode(editor, node)
        //     FileSystemManager.selectedDocument = document
        //     break
        default:
            throw new Error('처리되지 않은 명령어:' + command.name)
        }
    }

    public handleEditorChange (editor: Editor) {
        try {
            const { selection } = editor
            if (!selection || !Range.isCollapsed(selection)) {
                return false
            }
            const currentNode = editor.children[selection.anchor.path[0]]
            if (Element.isElement(currentNode) && currentNode.type === 'code') {
                return false
            }
            const [start] = Range.edges(selection)
            // 시작점을 가져옴
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const wordBeforeText = Editor.string(editor, Editor.range(editor, wordBefore, start))
            const before = wordBeforeText[wordBeforeText.length - 1] === '/' ? Editor.before(editor, start, { unit: 'character' }) : Editor.before(editor, wordBefore, { unit: 'character' })
            const beforeRange = before && Editor.range(editor, before, start)
            const beforeText = beforeRange && Editor.string(editor, beforeRange)
            const beforeMatch = beforeText && beforeText.match(/(^\/)/)
            const after = Editor.after(editor, start)
            const afterRange = Editor.range(editor, start, after)
            const afterText = Editor.string(editor, afterRange)
            const afterMatch = afterText.match(/^(\s|$)/)
            // console.log('matches')
            // console.log(beforeMatch)
            // console.log(afterMatch)
            if (beforeMatch && afterMatch) {
                this.target = beforeRange

                const searchResult = beforeText.match(/^\/((\w|\W)+)$/)
                if (!searchResult) {
                    this.search = ''
                } else {
                    this.search = searchResult[1]
                }
                this._searchedCommandGroupList = []
                this._searchedCommandCount = 0
                for (const commandGroup of this.commandGroupList) {
                    const searchedGroup = commandGroup.search(this.search)
                    if (searchedGroup.commands.length === 0) {
                        continue
                    }
                    this._searchedCommandGroupList.push(searchedGroup)
                    this._searchedCommandCount += searchedGroup.commands.length
                }
                this.index = 0
                return false
            } else {
                this.isSiblingVoid = false
                this.target = null
            }
        } catch (err) {
            console.log(err)
        }
    }

    checkIsCommandListOpen () {
        return this.target && this._searchedCommandGroupList.length > 0
    }

    getSearchedCommandByIndex (index: number) {
        for (const commandGroup of this._searchedCommandGroupList) {
            if (commandGroup.commands.length < index + 1) {
                index -= commandGroup.commands.length
                continue
            }
            return commandGroup.commands[index]
        }
    }

    handleArrowDown (event: React.KeyboardEvent, editor: Editor) {
        if (!this.checkIsCommandListOpen()) {
            return false
        }
        event.preventDefault()
        this.index = this.index >= this._searchedCommandCount - 1 ? 0 : this.index + 1
        return true
    }

    handleArrowUp (event: React.KeyboardEvent, editor: Editor) {
        if (!this.checkIsCommandListOpen()) {
            return false
        }
        event.preventDefault()
        this.index = this.index <= 0 ? this._searchedCommandCount - 1 : this.index - 1
        return true
    }

    handleEnterAndTab (event: React.KeyboardEvent, editor: Editor) {
        if (!this.checkIsCommandListOpen()) {
            return false
        }
        event.preventDefault()
        Transforms.select(editor, toJS(this.target))
        this.insertNodeByCommand(editor, this.getSearchedCommandByIndex(this.index))
            .then(() => {
                this.target = null
            })

        return true
    }

    handleEscape (event: React.KeyboardEvent, editor: Editor) {
        if (!this.checkIsCommandListOpen()) {
            return false
        }
        event.preventDefault()
        this.target = null
        return true
    }
}

export default new CommandManager()
