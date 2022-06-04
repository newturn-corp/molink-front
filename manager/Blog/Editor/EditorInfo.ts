import * as Y from 'yjs'
import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import { makeAutoObservable } from 'mobx'

export class EditorInfo {
    private yInfo: Y.Map<any> = null
    info: any = null
    isLocked: boolean = false

    constructor (yInfo: Y.Map<any>) {
        this.yInfo = yInfo
        this.yInfo.observeDeep(() => {
            this.info = this.yInfo.toJSON()
            const isLocked = this.yInfo.get('isLocked')
            if (this.isLocked !== isLocked) {
                this.isLocked = isLocked
                EventManager.issueEvent(Event.LockPage, { isLocked })
            }
        })
        makeAutoObservable(this)
    }

    updateIsLocked (isLocked: boolean) {
        this.yInfo.set('isLocked', isLocked)
    }

    reset () {
        this.yInfo = null
        this.info = null
        this.isLocked = false
    }
}
