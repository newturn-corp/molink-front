import Document from '../../domain/Document'
import GlobalManager from '../GlobalManager'

class EventManager {
    initGlobalVariableListener: (() => void)[] = []

    beforeUnloadListener: (() => void)[] = []
    deleteDocumentListener: ((document: Document) => void)[] = []
    openDocumentChildrenListener: ((document: Document, value: boolean) => void)[] = []
    changeDocumentIconListeners: ((document: Document, icon: string) => void)[] = []

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

    issueOpenDocumentChildrenEvent (document: Document, value: boolean) {
        this.openDocumentChildrenListener.forEach(listener => {
            listener(document, value)
        })
    }

    issueChangeDocumentIcon (document: Document, icon: string) {
        this.changeDocumentIconListeners.forEach(listener => {
            listener(document, icon)
        })
    }
}
export default new EventManager()
