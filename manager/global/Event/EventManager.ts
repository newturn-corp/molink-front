import { EventParam } from './EventParams'
import { Event, eventList } from './Event'

type EventListener = (param: EventParam) => void

class EventManager {
    private _eventListenerMap: Map<Event, { listener: EventListener, priority: number }[]> = new Map()
    private _disposableEventListenerMap: Map<Event, { listener: EventListener, priority: number }[]> = new Map()

    constructor () {
        eventList.forEach(event => {
            this._eventListenerMap.set(event, [])
            this._disposableEventListenerMap.set(event, [])
        })
    }

    public async issueEvent (event: Event, param: EventParam = {}) {
        const listeners = this._eventListenerMap.get(event)
        for (const listener of listeners) {
            await listener.listener(param)
        }
        const disposableListeners = this._disposableEventListenerMap.get(event)
        for (const listener of disposableListeners) {
            await listener.listener(param)
        }
        this._disposableEventListenerMap.set(event, [])
    }

    public addEventListener (event: Event, listener: EventListener, priority: number) {
        this._eventListenerMap.get(event).push({ listener, priority })
        this._eventListenerMap.get(event).sort((a, b) => a.priority - b.priority)
    }

    public addEventListeners (eventList: Event[], listener: EventListener, priority: number) {
        eventList.forEach(event => {
            this._eventListenerMap.get(event).push({ listener, priority })
            this._eventListenerMap.get(event).sort((a, b) => a.priority - b.priority)
        })
    }

    public addDisposableEventListener (event: Event, listener: EventListener, priority: number) {
        this._disposableEventListenerMap.get(event).push({ listener, priority })
        this._disposableEventListenerMap.get(event).sort((a, b) => a.priority - b.priority)
    }

    public addDisposableEventListeners (eventList: Event[], listener: EventListener, priority: number) {
        eventList.forEach(event => {
            this._disposableEventListenerMap.get(event).push({ listener, priority })
            this._disposableEventListenerMap.get(event).sort((a, b) => a.priority - b.priority)
        })
    }
}
export default new EventManager()
