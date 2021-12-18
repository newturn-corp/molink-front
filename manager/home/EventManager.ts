import { reaction } from 'mobx'
import Document from '../../domain/Document'
import GlobalManager from '../GlobalManager'

class EventManager {
    initGlobalVariableListener: (() => void)[] = []

    beforeUnloadListener: (() => void)[] = []
    deleteDocumentListener: ((document: Document) => void)[] = []
    openDocumentChildrenListener: ((document: Document) => void)[] = []

    constructor () {
        this.initGlobalVariableListener.push(() => this.addGlobalEventListener())
    }

    addGlobalEventListener () {
        GlobalManager.window.addEventListener('beforeunload', () => {
            this.beforeUnloadListener.forEach(listener => {
                listener()
            })
        })
    }

    issueInitGlobalVariable () {
        this.initGlobalVariableListener.forEach(listener => {
            listener()
        })
    }

    issueDeleteDocumentEvent (document: Document) {
        this.deleteDocumentListener.forEach(listener => {
            listener(document)
        })
    }

    issueOpenDocumentChildrenEvent (document: Document) {
        this.openDocumentChildrenListener.forEach(listener => {
            listener(document)
        })
    }
}
export default new EventManager()
