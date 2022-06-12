import { makeAutoObservable } from 'mobx'
import * as Y from 'yjs'
import { SetHeaderIconActiveDTO } from '@newturn-develop/types-molink'
import HierarchyAPI from '../../../api/HierarchyAPI'
import UserManager from '../User/UserManager'

export class BlogSetting {
    ySetting: Y.Map<any> = null
    public headerIconActive: boolean = false

    constructor (ySetting: Y.Map<any>) {
        this.ySetting = ySetting
        this.ySetting.observeDeep(() => {
            this.headerIconActive = this.ySetting.get('headerIconActive')
        })
        makeAutoObservable(this, {
            ySetting: false
        })
    }

    async setHeaderIconActive (active: boolean) {
        await HierarchyAPI.setBlogHeaderIconActive(new SetHeaderIconActiveDTO(UserManager.userId, active))
    }
}
