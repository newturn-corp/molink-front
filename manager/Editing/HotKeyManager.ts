import { KeyboardEvent } from 'react'
import { Editor, Transforms } from 'slate'
import EditorManager from '../Home/EditorManager'

// 단축키를 눌러 사용하는 명령을 담당하는 매니저
class HotKeyManager {
    async handleKeyDown (e: KeyboardEvent<HTMLDivElement>, editor: Editor) {
        const keys = []
        if (e.shiftKey) {
            keys.push('shift')
        } else if (e.altKey) {
            keys.push('alt')
        } else if (e.ctrlKey) {
            keys.push('ctrl')
        }
        keys.push(e.key)

        switch (keys.join('+')) {
        case 'ArrowLeft':
            e.preventDefault()
            Transforms.move(EditorManager.slateEditor, {
                unit: 'offset',
                reverse: true
            })
            break
        case 'ArrowRight':
            e.preventDefault()
            Transforms.move(EditorManager.slateEditor, { unit: 'offset' })
            break
        case 'shift+Enter':
            e.preventDefault()
            editor.insertText('\n')
            // const endPoint = Range.end(editor.selection)
            // Transforms.setSelection(editor, {
            //     anchor: endPoint,
            //     focus: endPoint
            // })
            // editor.insertBreak()
            // Transforms.move(editor, { distance: 1, unit: 'character' })
            break
            // case 'Enter':
            //     if (editor.selection && editor.children[editor.selection.anchor.path[0]].type === 'code') {
            //         e.preventDefault()
            //         editor.insertText('\n')
            //     }
            //     break
        case 'ctrl+O':
        case 'ctrl+o':
            e.preventDefault()
            editor.insertText('sdksdkds')
            break
        case 'ctrl+z':
            e.preventDefault()
            editor.undo()
            break
        case 'ctrl+y':
            e.preventDefault()
            editor.redo()
            break
        }
    }
}

export default new HotKeyManager()
