import { makeAutoObservable } from 'mobx'
import UserInfoMap from '../../../global/User/UserInfoMap'

export class EditorPageUserInfo {
    userID: number
    nickname: string = null
    profileImageUrl: string = null
    biography: string = null

    constructor (userID: number) {
        this.userID = userID
        makeAutoObservable(this)
    }

    async load () {
        const infoMap = await UserInfoMap.getUserInfoMapByUserIDList([this.userID])
        const userInfo = infoMap[this.userID]
        this.nickname = userInfo.nickname
        this.profileImageUrl = userInfo.profileImageUrl
        this.biography = userInfo.biography
    }
}
