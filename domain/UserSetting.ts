import { makeAutoObservable } from 'mobx'
import UserAPI from '../api/UserAPI'

export default class UserSetting {
    followWithoutApprove: boolean = false

    constructor (followWithoutApprove: boolean) {
        makeAutoObservable(this)
        this.followWithoutApprove = followWithoutApprove
    }

    setFollowWithoutApprove (value: boolean) {
        this.followWithoutApprove = value
        return UserAPI.setUserFollowWithoutApprove(value)
    }
}
