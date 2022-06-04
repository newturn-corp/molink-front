import * as Y from 'yjs'

export class EditorSelection {
    ySelection: Y.Map<any> = null
    selectionMap: any

    constructor (ySelection: Y.Map<any>) {
        this.ySelection = ySelection
        this.ySelection.observeDeep(() => {
            this.selectionMap = this.ySelection.toJSON()
        })
    }
}
