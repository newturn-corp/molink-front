import { HierarchyAction, HierarchyActionType } from './HierarchyAction'
import EventManager, { Event } from '../../EventManager'
import DocumentAPI from '../../../api/DocumentAPI'
import { CreateDocumentDTO } from '@newturn-develop/types-molink/dist/DTO'

class HierarchyActionQueue {
    private _queue: HierarchyAction[]

    // 유저 인증 시
    constructor () {
        EventManager.addEventLinstener(Event.InitGlobalVariable, () => {
            this._queue = JSON.parse(localStorage.getItem('hierarchyActionQueue')) || []
            localStorage.removeItem('hierarchyActionQueue')
            window.addEventListener('online', async () => {
                await this.actQueuedActions()
            })
            EventManager.addEventLinstener(Event.UnloadPage, () => {
                localStorage.setItem('hierarchyActionQueue', JSON.stringify(this._queue))
            }, 1)
        }, 1)
    }

    async act (action: HierarchyAction) {
        if (!navigator.onLine) {
            return this._queue.unshift(action)
        }
        switch (action.type) {
        case HierarchyActionType.CreateDocument:
            await DocumentAPI.createDocument(action.dto as CreateDocumentDTO)
            break
        }
    }

    async actQueuedActions () {
        if (this._queue.length === 0) {
            return
        }
        const action = this._queue.pop()
        await this.act(action)
        await this.actQueuedActions()
    }
}
export default new HierarchyActionQueue()
