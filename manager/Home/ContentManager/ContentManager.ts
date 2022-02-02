import { makeAutoObservable } from 'mobx'
import Automerge from 'automerge'
import { DocumentContentInterface } from '@newturn-develop/types-molink'
import { Descendant, Editor, Operation, Selection } from 'slate'
import { HistoryEditor } from 'slate-history'
import ContentSynchronizer from './ContentSynchronizer'
import { v4 as uuidv4 } from 'uuid'
import { AutomergeChangeEventDTO } from '@newturn-develop/types-molink/dist/DTO'
import {
    convertAutomergeChangesThroughNetwork,
    getAutomergeDocumentThroughNetwork
} from '@newturn-develop/molink-automerge-wrapper'
import ViewerAPI from '../../../api/ViewerAPI'
import UserManager from '../../global/UserManager'
import { Throttle } from '../../../utils/Throttle'
import { handleOperation } from '@newturn-develop/molink-slate-operation'

class ContentManager {
    editor: Editor
    editable: boolean = false
    contentValue: Automerge.FreezeObject<DocumentContentInterface> = null
    lastSendedContentValue: Automerge.FreezeObject<DocumentContentInterface> = null
    set automergeValue (value: Automerge.FreezeObject<DocumentContentInterface>) {
        this.contentValue = value
        Editor.withoutNormalizing(this.editor, () => {
            HistoryEditor.withoutSaving(this.editor, () => {
                console.log(this.editor.children)
                this.editor.children = JSON.parse(JSON.stringify(value.children))
                console.log(this.editor.children)
            })
        })
        console.log(this.editor.children)
        this.content = JSON.parse(JSON.stringify(value))
    }

    content: DocumentContentInterface = null

    constructor () {
        makeAutoObservable(this, {
            contentValue: false,
            lastSendedContentValue: false
        })
    }

    public async loadContent (documentId: string) {
        const dto = await ViewerAPI.getContent(documentId)
        this.automergeValue = getAutomergeDocumentThroughNetwork(dto.content)
        this.lastSendedContentValue = this.contentValue
        this.editable = UserManager.profile && UserManager.profile.userId === this.content.userId
        if (this.editable) {
            await ContentSynchronizer.connect(documentId)
        }
    }

    public handleChangeFromOtherClient (changes: Automerge.BinaryChange[]) {
        console.log('handle change from other client')
        const [newContent, patch] = Automerge.applyChanges(this.contentValue, changes)
        try {
            for (const value of Object.values(patch.diffs.props.children)) {
                console.log(value)
            }
        } catch (err) {
            console.log(err)
        }
        console.log(JSON.parse(JSON.stringify(newContent)))
        this.automergeValue = newContent
    }

    public async handleChange (selection: Selection, operations: Operation[]) {
        // const start = performance.now()
        if (operations.length === 0) {
            return
        }
        this.contentValue = Automerge.change(this.contentValue, contentValue => {
            // this.editor.operations.forEach(operation => handleOperation(contentValue, this.editor.selection, operation))
            for (const operation of operations) {
                handleOperation(contentValue, selection, operation)
            }
        })
        this.sendChange()
    }

    @Throttle(1000)
    private sendChange () {
        const changes = Automerge.getChanges(this.lastSendedContentValue, this.contentValue)
        console.log(JSON.parse(JSON.stringify(this.lastSendedContentValue)))
        console.log(JSON.parse(JSON.stringify(this.contentValue)))
        ContentSynchronizer.sendChange(new AutomergeChangeEventDTO(uuidv4(), convertAutomergeChangesThroughNetwork(changes)))
        this.lastSendedContentValue = this.contentValue
    }
}
export default new ContentManager()
