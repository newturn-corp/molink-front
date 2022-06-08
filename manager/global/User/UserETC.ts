import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface } from '@newturn-develop/types-molink'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import { isBrowser } from 'react-device-detect'
import ModalManager from '../ModalManager'
import RoutingManager from '../RoutingManager'
import TutorialManager from '../TutorialManager'

export class UserETC {
    yETC: Y.Map<any> = null
    etc: any = null

    constructor () {
        makeAutoObservable(this, {
            yETC: false
        })
    }

    async sync (yETC: Y.Map<any>) {
        this.yETC = yETC
        this.yETC.observeDeep(async () => {
            if (!this.yETC.get('shownTutorial')) {
                this.yETC.set('shownTutorial', true)
                TutorialManager.openTutorialModal()
            }
        })
    }

    reset () {
        this.yETC = null
        this.etc = null
    }
}
