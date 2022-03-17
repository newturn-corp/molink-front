import { TextCategory } from '../../Types/slate/CustomElement'
import { Element as SlateElement } from 'slate'

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
}
export default new ShortcutManager()
