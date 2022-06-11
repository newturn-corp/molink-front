import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import EditorPage from '../../../Blog/Editor/EditorPage'

export class UserEditorSetting {
    yEditorSetting: Y.Map<any> = null
    toolbarEnable: boolean = false

    constructor () {
        makeAutoObservable(this, {
            yEditorSetting: false
        })
    }

    sync (yEditorSetting: Y.Map<any>) {
        this.yEditorSetting = yEditorSetting
        this.yEditorSetting.observeDeep(async () => {
            this.toolbarEnable = this.yEditorSetting.get('toolbarEnable')
        })
    }

    reset () {
        this.yEditorSetting = null
        this.toolbarEnable = false
    }

    enableToolbar () {
        this.yEditorSetting.set('toolbarEnable', true)
        const editor = EditorPage.editor
        if (editor) {
            editor.toolbar.tryEnable()
        }
    }

    disableToolbar () {
        this.yEditorSetting.set('toolbarEnable', false)
        const editor = EditorPage.editor
        if (editor) {
            editor.toolbar.disable()
        }
    }
}
