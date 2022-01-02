import { makeAutoObservable } from 'mobx'
import SettingAPI from '../api/SettingAPI'

export default class UserSetting {
    followWithoutApprove: boolean = false
    showSubDocumentCount: boolean = false

    constructor (followWithoutApprove: boolean, showSubDocumentCount: boolean) {
        makeAutoObservable(this)
        this.followWithoutApprove = followWithoutApprove
        this.showSubDocumentCount = showSubDocumentCount
    }

    setFollowWithoutApprove (value: boolean) {
        this.followWithoutApprove = value
        return SettingAPI.setFollowWithoutApprove(value)
    }

    setShowSubDocumentCount (value: boolean) {
        this.showSubDocumentCount = value
        return SettingAPI.setShowSubDocumentCount(value)
    }
}
