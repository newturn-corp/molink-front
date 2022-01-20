import { Editor, Location, Transforms } from 'slate'
import OnlineManager from './Online/OnlineManager'
import Automerge from 'automerge'
import { OpenedDocumentInfo } from '../../domain/OpenedDocumentInfo'

class ContentManager {
    editor: Editor = null
    automergeDocument: Automerge.FreezeObject<OpenedDocumentInfo>

    isLoadingContent: boolean = false

    async tryOpenDocumentByDocumentId (documentId: string) {
        OnlineManager.connect(documentId)
    }

    updateTitle (title: string) {
        // if (!this.openedDocument || this.openedDocument.meta.title === title || this.openedDocument.directoryInfo.isChangingName) {
        //     return
        // }
        // this.openedDocument.meta.title = title
        // EventManager.issueEvent(Event.ChangeDocumentTitleInEditor, { title })
    }

    select (target: Location) {
        Transforms.select(this.editor, target)
    }
}
export default new ContentManager()
