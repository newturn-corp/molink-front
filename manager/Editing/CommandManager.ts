import { makeAutoObservable, toJS } from 'mobx'
import React from 'react'
import { BaseRange, Editor, Element, Node, Range, Transforms } from 'slate'
import Command from '../../domain/Command'
import { DividerType, TextCategory } from '../../Types/slate/CustomElement'
import { ListTransforms } from '../../plugin/GlobalPlugins/ListPlugin'

// /(슬래시)로 수행하는 명령을 맡아 처리하는 매니저
class CommandManager {
    target: BaseRange = null
    search: string = ''
    index: number = 0
    _searchedCommands: Command[] = []
    get searchedCommands () {
        return toJS(this._searchedCommands)
    }

    commandsList = [
        new Command('제목1', '큰 사이즈의 제목', '/command/head1.svg'),
        new Command('제목2', '중간 사이즈의 제목', '/command/head2.svg'),
        new Command('제목3', '작은 사이즈의 제목', '/command/head3.svg'),
        new Command('구분선-기본', '기본 구분선', '/command/divider-default.svg'),
        new Command('구분선-흐릿한', '흐릿한 구분선', '/command/divider-faint.svg'),
        new Command('구분선-짦은', '짦은 구분선', '/command/divider-short.svg'),
        new Command('구분선-짦고 흐릿한', '짦고 흐릿한 구분선', '/command/divider-faint-short.svg'),
        new Command('구분선-점', '점 구분선', '/command/divider-dot.svg'),
        // new Command('새문서', '새로운 하위 문서를 만듭니다.', '/command/document.svg'),
        new Command('순서없는목록', '순서 없는 목록', '/command/bullet-list.svg'),
        new Command('숫자목록', '숫자 목록', '/command/ordered-list.svg'),
        new Command('체크목록', '체크 목록', '/command/check-list.svg')
    ]

    isSiblingVoid: boolean = false

    constructor () {
        makeAutoObservable(this)
        this._searchedCommands = this.commandsList
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
        if (this.isSiblingVoid) {
            Transforms.delete(editor)
            Transforms.setNodes<Element>(editor, node, {
                match: n => Editor.isBlock(editor, n)
            })
        } else {
            Transforms.insertNodes(editor, node)
        }
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
        // case '새문서':
        //     if (!ContentManager.openedDocument) {
        //         return
        //     }
        //     const document = await Document.create(ContentManager.openedDocument, ContentManager.openedDocument.directoryInfo.children.length)
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

    handleEditorChange (editor: Editor) {
        try {
            const { selection } = editor
            if (selection && Range.isCollapsed(selection)) {
                const [start] = Range.edges(selection)
                // 시작점을 가져옴
                const wordBefore = Editor.before(editor, start, { unit: 'word' })
                let before = wordBefore && Editor.before(editor, wordBefore)
                const parent = Node.parent(editor, before.path) as Element
                this.isSiblingVoid = editor.isVoid(parent)
                before = this.isSiblingVoid ? wordBefore : before
                const beforeRange = before && Editor.range(editor, before, start)
                const beforeText = beforeRange && Editor.string(editor, beforeRange)
                const beforeMatch = beforeText && beforeText.match(/^\//)
                const after = Editor.after(editor, start)
                const afterRange = Editor.range(editor, start, after)
                const afterText = Editor.string(editor, afterRange)
                const afterMatch = afterText.match(/^(\s|$)/)

                if (beforeMatch && afterMatch) {
                    this.target = beforeRange

                    const searchResult = beforeText.match(/^\/((\w|\W)+)$/)
                    if (!searchResult) {
                        this.search = ''
                    } else {
                        this.search = searchResult[1]
                    }
                    this._searchedCommands = this.commandsList.filter(command =>
                        command.name.startsWith(this.search.toLowerCase())
                    )
                    this.index = 0
                    return
                }
            }
            this.target = null
        } catch (err) {

        }
    }

    async handleKeyDown (event: React.KeyboardEvent, editor: Editor) {
        if (this.target && this._searchedCommands.length > 0) {
            switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                this.index = this.index >= this._searchedCommands.length - 1 ? 0 : this.index + 1
                break
            case 'ArrowUp':
                event.preventDefault()
                this.index = this.index <= 0 ? this._searchedCommands.length - 1 : this.index - 1
                break
            case 'Tab':
            case 'Enter':
                event.preventDefault()
                Transforms.select(editor, toJS(this.target))
                await this.insertNodeByCommand(editor, this._searchedCommands[this.index])
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
