import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface } from '@newturn-develop/types-molink'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import { isBrowser } from 'react-device-detect'

export class UserSetting {
    ySetting: Y.Map<any> = null
    setting: UserSettingInterface = null
    hierarchyWidth: number = 240
    showSubDocumentCount: boolean = false

    hierarchyBackgroundColor: string = isBrowser ? '#FAFAFB' : 'transparent'
    hierarchySelectedDocumentBackgroundColor: string = '#ECEEF0'

    constructor () {
        makeAutoObservable(this, {
            ySetting: false
        })
    }

    sync (ySetting: Y.Map<any>) {
        this.ySetting = ySetting
        this.ySetting.observeDeep(async () => {
            this.setting = this.ySetting.toJSON() as any
            const newHierarchyWidth = this.ySetting.get('hierarchyWidth')
            if (isBrowser && this.hierarchyWidth !== newHierarchyWidth) {
                this.hierarchyWidth = newHierarchyWidth
                await EventManager.issueEvent(
                    Event.HierarchyWidthChange,
                    { width: newHierarchyWidth }
                )
            }

            this.showSubDocumentCount = this.ySetting.get('showSubDocumentCount')
        })
    }

    reset () {
        this.ySetting = null
        this.setting = null
        this.hierarchyWidth = 240
        this.showSubDocumentCount = false
        this.hierarchyBackgroundColor = '#FAFAFB'
        this.hierarchySelectedDocumentBackgroundColor = '#ECEEF0'
    }

    updateHierarchyWidth (width: number) {
        this.ySetting.set('hierarchyWidth', width)
    }
}
