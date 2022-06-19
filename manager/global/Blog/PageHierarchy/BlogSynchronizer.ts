import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { HierarchyNotExists } from '../../../../Errors/HierarchyError'

export class BlogSynchronizer {
    public websocketProvider: WebsocketProvider = null

    constructor (id: number, yDocument: Y.Doc) {
        this.websocketProvider = new WebsocketProvider(
            process.env.HIERARCHY_LIVE_SERVER_URL,
            id.toString(),
            yDocument, {
                connect: false
            })
    }

    connect (yMap: Y.Map<any>) {
        return new Promise<void>((resolve, reject) => {
            let isResolved = false
            const listener = () => {
                isResolved = true
                yMap.unobserveDeep(listener)
                resolve()
            }
            yMap.observeDeep(listener)
            this.websocketProvider.connect()
            setTimeout(() => {
                if (!isResolved) {
                    yMap.unobserveDeep(listener)
                    reject(new HierarchyNotExists())
                }
            }, 10000)
        })
    }

    reset () {
        this.websocketProvider.destroy()
    }
}
