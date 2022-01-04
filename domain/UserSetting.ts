import { makeAutoObservable } from 'mobx'
import SettingAPI from '../api/SettingAPI'

export default class UserSetting {
    followWithoutApprove: boolean = false
    showSubDocumentCount: boolean = false
    fileSystemWidth: number = 240

    constructor (followWithoutApprove: boolean, showSubDocumentCount: boolean, fileSystemWidth: number) {
        makeAutoObservable(this)
        this.followWithoutApprove = followWithoutApprove
        this.showSubDocumentCount = showSubDocumentCount
        this.fileSystemWidth = fileSystemWidth
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
