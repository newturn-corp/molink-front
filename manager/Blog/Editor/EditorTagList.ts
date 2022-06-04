import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'

export class EditorTagList {
    private yTags: Y.Array<string> = null
    tags: string[] = []

    constructor (yTags: Y.Array<string>) {
        this.yTags = yTags
        this.yTags.observeDeep(() => {
            this.tags = this.yTags.toArray()
        })
        makeAutoObservable(this)
    }

    public add (text: string) {
        this.yTags.push([text])
    }

    public remove (index: number) {
        this.yTags.delete(index)
    }
}
