import Document from '../../domain/Document'

class EventManager {
    deleteDocumentListener: ((document: Document) => void)[] = []

    issueDeleteDocumentEvent (document: Document) {
        this.deleteDocumentListener.forEach(listener => {
            listener(document)
        })
    }
}
export default new EventManager()
