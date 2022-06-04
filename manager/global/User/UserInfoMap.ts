import { ESUser } from '@newturn-develop/types-molink'
import ViewerAPI from '../../../api/ViewerAPI'
import { makeAutoObservable } from 'mobx'

class UserInfoMap {
    idMap: { [index: number]: ESUser } = {}
    nicknameMap: { [index: string]: ESUser } = {}

    constructor () {
        makeAutoObservable(this)
    }

    async updateUserInfoMapByUserIDList (userIDList: number[]) {
        const newUserIDList: number[] = userIDList.filter((userID) => !this.idMap[userID])
        if (newUserIDList.length > 0) {
            const { infoMap } = await ViewerAPI.getUserInfoMapByIDList(newUserIDList)
            for (const userID of newUserIDList) {
                const info = infoMap[userID] as ESUser
                this.idMap[userID] = info
                if (this.nicknameMap[info.nickname]) {
                    this.nicknameMap[info.nickname] = info
                }
            }
        }
    }

    async updateUserInfoMapByUserNicknameList (userNicknameList: string[]) {
        const newUserNicknameList: string[] = userNicknameList.filter((nickname) => !this.nicknameMap[nickname])
        if (newUserNicknameList.length > 0) {
            const { infoMap } = await ViewerAPI.getUserInfoMapByNicknameList(newUserNicknameList)
            for (const nickname of newUserNicknameList) {
                const info = infoMap[nickname] as ESUser
                this.nicknameMap[nickname] = info
                if (this.idMap[Number(info.id)]) {
                    this.idMap[Number(info.id)] = info
                }
            }
        }
    }

    async getUserInfoMapByUserIDList (userIDList: number[]) {
        const map: { [index: number]: ESUser } = {}
        const newUserIDList: number[] = []
        for (const userID of userIDList) {
            if (this.idMap[userID]) {
                map[userID] = this.idMap[userID]
            } else {
                newUserIDList.push(userID)
            }
        }
        if (newUserIDList.length > 0) {
            const { infoMap } = await ViewerAPI.getUserInfoMapByIDList(newUserIDList)
            for (const userID of newUserIDList) {
                this.idMap[userID] = infoMap[userID]
                map[userID] = infoMap[userID]
            }
        }
        return map
    }

    async getUserInfoMapByUserNicknameList (userNicknameList: string[]) {
        const map: { [index: string]: ESUser } = {}
        const newUserNicknameList: string[] = []
        for (const userNickname of userNicknameList) {
            if (this.idMap[userNickname]) {
                map[userNickname] = this.idMap[userNickname]
            } else {
                newUserNicknameList.push(userNickname)
            }
        }
        if (newUserNicknameList.length > 0) {
            const { infoMap } = await ViewerAPI.getUserInfoMapByNicknameList(newUserNicknameList)
            for (const userNickname of newUserNicknameList) {
                this.idMap[userNickname] = infoMap[userNickname]
                map[userNickname] = infoMap[userNickname]
            }
        }
        return map
    }
}
export default new UserInfoMap()
