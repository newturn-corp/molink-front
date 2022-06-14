import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import {
    BaseRange,
    Editor as SlateEditor,
    Editor,
    Element as SlateElement,
    Element,
    Range,
    Transforms
} from 'slate'
import { AvailCodeLanguage, DividerType, TextCategory } from '../../../Types/slate/CustomElement'
import { ListEditor, ListTransforms } from '../../../plugin/GlobalPlugins/ListPlugin'
import Command from './Command'
import CommandGroup from './CommandGroup'
import BulbIcon from '../../../public/image/icon/bulb.svg'
import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import LanguageManager from '../../global/LanguageManager'
import CodeIcon from 'public/image/icon/code.svg'
import BookmarkOutlineIcon from 'public/image/icon/bookmark-outline.svg'
import EditorPage from '../../Blog/Editor/EditorPage'
import { ReactEditor } from 'slate-react'

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
            'Title',
            [new Command('Title1', 'TitleCommand1Description', '/image/editor/command/head1.png'),
                new Command('Title2', 'TitleCommand2Description', '/image/editor/command/head2.png'),
                new Command('Title3', 'TitleCommand3Description', '/image/editor/command/head3.png')]
        ),
        new CommandGroup(
            'List',
            [
                new Command('BulletListCommandName', 'BulletListCommandDescription', '/image/editor/command/bullet-list.png'),
                new Command('OrderedListCommandName', 'OrderedListCommandDescription', '/image/editor/command/ordered-list.png'),
                new Command('CheckListCommandName', 'CheckListCommandDescription', '/image/editor/command/check-list.png')
            ]
        ),
        new CommandGroup(
            'Accent',
            [
                new Command('CalloutCommandName', 'CalloutCommandDescription', <BulbIcon/>, 'callout-command', 'svg')
            ]
        ),
        new CommandGroup(
            'Media',
            [
                new Command('CodeCommandName', 'CodeCommandDescription', <CodeIcon/>, 'code-command', 'svg'),
                new Command('BookmarkCommandName', 'BookmarkCommandDescription', <BookmarkOutlineIcon/>, 'bookmark-command', 'svg')
            ]
        ),
        new CommandGroup(
            'ETCCommandGroupName',
            [
                new Command('DividerCommandName', 'DividerCommandDescription', '/image/editor/command/divider-default.png')
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
        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.target = null
        }, 1)
    }

    // 바로 위 노드가 void인 경우, 현재 node를 set하고
    // 일반적인 경우, insertNode를 함
    insertNode (editor: Editor, node: Element) {
        if (!editor.selection) {
            Transforms.select(editor, EditorPage.editor.lastSelection)
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
        return editor.selection.focus.path
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
        case LanguageManager.languageMap.Title1:
            node = {
                type: 'text',
                category: TextCategory.Head1,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case LanguageManager.languageMap.Title2:
            node = {
                type: 'text',
                category: TextCategory.Head2,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case LanguageManager.languageMap.Title3:
            node = {
                type: 'text',
                category: TextCategory.Head3,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case LanguageManager.languageMap.DividerCommandName:
            node = {
                type: 'divider',
                dividerType: DividerType.LongLine,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case LanguageManager.languageMap.CalloutCommandName:
            node = {
                type: 'callout',
                icon: '💡',
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        case LanguageManager.languageMap.BulletListCommandName:
            if (ListEditor.isSelectionInList(editor)) {
                break
            }
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
        case LanguageManager.languageMap.OrderedListCommandName:
            if (ListEditor.isSelectionInList(editor)) {
                break
            }
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
        case LanguageManager.languageMap.CheckListCommandName:
            if (ListEditor.isSelectionInList(editor)) {
                break
            }
            const checklistRange = {
                anchor: {
                    offset: 0,
                    path: editor.selection.focus.path
                },
                focus: editor.selection.focus
            }
            Transforms.select(editor, checklistRange)
            Transforms.delete(editor)
            ListTransforms.wrapInList(editor, 'check-list')
            const newProperties: Partial<SlateElement> = {
                type: 'check-list-item',
                checked: false
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n) && n.type === 'list-item'
            })
            break
        case LanguageManager.languageMap.CodeCommandName:
            node = {
                type: 'code',
                language: AvailCodeLanguage.Javascript,
                children: [{
                    text: '',
                    codeLanguage: AvailCodeLanguage.Javascript
                }]
            }
            Transforms.insertNodes(editor, node)
            break
        case LanguageManager.languageMap.BookmarkCommandName:
            node = {
                type: 'temp-bookmark',
                isFirstInputOpen: false,
                children: [{ text: '' }]
            }
            this.insertNode(editor, node)
            break
        // case '페이지':
        //     if (!ContentManager.openedDocument) {
        //         return
        //     }
        //     const document = await Page.create(ContentManager.openedDocument, ContentManager.openedDocument.directoryInfo.children.length)
        //     node = {
        //         type: 'document',
        //         pageID: document.meta.id,
        //         children: [{ text: '' }]
        //     }
        //     EventManager.addDisposableEventListener(Event.LoadingContent, ({ editor }: { editor: EditorManager }) => {
        //         Transforms.select(editor, [0, 0])
        //     }, 1)
        //     EventManager.addDisposableEventListener(Event.EditorChange, () => {
        //         RoutingManager.moveTo(Page.MainPageComponent, `?id=${document.meta.id}`)
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
            if (!start) {
                return false
            }
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
            if (beforeMatch && afterMatch && EditorPage.editor.lastPressedKey === '/') {
                this.target = beforeRange

                const searchResult = beforeText.match(/^\/((\w|\W)+)$/)
                if (!searchResult) {
                    this.search = ''
                } else {
                    this.search = searchResult[1]
                }
                this._searchedCommandGroupList = []
                this._searchedCommandCount = 0
                const isInsideList = ListEditor.isSelectionInList(editor)
                for (const commandGroup of this.commandGroupList) {
                    const searchedGroup = commandGroup.search(this.search)
                    if (searchedGroup.commands.length === 0) {
                        continue
                    }
                    if (isInsideList && LanguageManager.languageMap.List === searchedGroup.name) {
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

    handleEnterAndTabAndClick (event: React.KeyboardEvent | React.MouseEvent, editor: Editor) {
        if (!this.checkIsCommandListOpen()) {
            return false
        }
        event.preventDefault()
        Transforms.select(editor, toJS(this.target))
        ReactEditor.focus(editor)
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
