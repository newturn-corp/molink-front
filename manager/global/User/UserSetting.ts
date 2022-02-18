import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface } from '@newturn-develop/types-molink'

export class UserSetting {
    ySetting: Y.Map<any> = null
    setting: UserSettingInterface = null
    hierarchyWidth: string = '10vw'

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

    updateHierarchyWidth (width: string) {
        this.ySetting.set('hierarchyWidth', width)
    }
}
