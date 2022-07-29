import { TextCategory } from '../../Types/slate/CustomElement'
import { Editor as SlateEditor, Editor, Element as SlateElement, Node, Path, Transforms } from 'slate'
import { ListElement, ListTransforms } from '../../plugin'

class ShortcutManager {
    getPropertyByShortcut (shortcut: string): Partial<SlateElement> {
        switch (shortcut) {
        case '#':
            return {
                type: 'text',
                category: TextCategory.Head1
            }
        case '##':
            return {
                type: 'text',
                category: TextCategory.Head2
            }
        case '###':
            return {
                type: 'text',
                category: TextCategory.Head3
            }
        case '>':
            return {
                type: 'block-quote'
            }
        default:
            throw new Error('UnhandledShortCut')
        }
    }

    isBeforeNodeList (editor: Editor, path: Path) {
        if (path[0] > 0) {
            const beforeNode = Node.get(editor, [path[0] - 1])
            return ['ul-list', 'ol-list', 'check-list'].includes(beforeNode.type)
        }
    }

    handleInsertList (editor: Editor, type: string, path: Path, beforeText: string) {
        if (path[0] > 0) {
            const beforeNode = Node.get(editor, [path[0] - 1])
            if (['ul-list', 'ol-list', 'check-list'].includes(beforeNode.type)) {
                const targetPath = [path[0] - 1, beforeNode.children.length]
                if (type === 'unordered-list') {
                    Transforms.insertNodes(editor, {
                        type: 'list-item',
                        children: [{
                            type: 'text',
                            category: TextCategory.Content3,
                            children: [{ text: '' }]
                        }]
                    }, {
                        at: targetPath
                    })
                } else if (type === 'ol-list') {
                    Transforms.insertNodes(editor, {
                        type: 'ordered-list-item',
                        children: [{
                            type: 'text',
                            category: TextCategory.Content3,
                            children: [{ text: '' }]
                        }]
                    }, {
                        at: targetPath
                    })
                } else if (type === 'check-list') {
                    Transforms.insertNodes(editor, {
                        type: 'check-list-item',
                        children: [{
                            type: 'text',
                            category: TextCategory.Content3,
                            children: [{ text: '' }]
                        }]
                    }, {
                        at: targetPath
                    })
                }
                Transforms.select(editor, targetPath)
                return true
            }
        }

        if (type === 'unordered-list') {
            ListTransforms.wrapInList(editor)
            return true
        } else if (type === 'ol-list') {
            const start = beforeText.split('.')[0]
            ListTransforms.wrapInList(editor, 'ol-list', { start: Number(start) })
            const newProperties: Partial<SlateElement> = {
                type: 'ordered-list-item'
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n) && ListElement.isItem(n)
            })
            return true
        } else if (type === 'check-list') {
            ListTransforms.wrapInList(editor, 'check-list')
            const newProperties: Partial<SlateElement> = {
                type: 'check-list-item',
                checked: false
            }
            Transforms.setNodes<SlateElement>(editor, newProperties, {
                match: n => SlateEditor.isBlock(editor, n) && ListElement.isItem(n)
            })
            return true
        }
    }
}
export default new ShortcutManager()
