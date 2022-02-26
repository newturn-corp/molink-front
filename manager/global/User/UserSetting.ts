import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface } from '@newturn-develop/types-molink'

export class UserSetting {
    ySetting: Y.Map<any> = null
    setting: UserSettingInterface = null
    hierarchyWidth: number = 240

    hierarchyBackgroundColor: string = '#FAFAFB'
    hierarchySelectedDocumentBackgroundColor: string = '#ECEEF0'

    constructor (ySetting: Y.Map<any>) {
        this.ySetting = ySetting
        this.ySetting.observeDeep(() => {
            this.setting = this.ySetting.toJSON()
            this.hierarchyWidth = this.ySetting.get('hierarchyWidth')
        })
        makeAutoObservable(this, {
            ySetting: false
        })
    }

    updateHierarchyWidth (width: number) {
        this.ySetting.set('hierarchyWidth', width)
    }
}
