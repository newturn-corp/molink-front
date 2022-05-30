import { ESUser } from '@newturn-develop/types-molink'
import ViewerAPI from '../../../api/ViewerAPI'
import { makeAutoObservable } from 'mobx'

class UserInfoMap {
    map: { [index: number]: ESUser } = {}

    constructor () {
        makeAutoObservable(this)
    }

    async updateUserInfoMap (userIDList: number[]) {
        const newUserIDList: number[] = userIDList.filter((userID) => !this.map[userID])
        if (newUserIDList.length > 0) {
            const { infoMap } = await ViewerAPI.getUserInfoMapByIDList(newUserIDList)
            for (const userID of newUserIDList) {
                this.map[userID] = infoMap[userID]
            }
        }
    }

    async getUserInfoMapByUserIDList (userIDList: number[]) {
        const map: { [index: number]: ESUser } = {}
        const newUserIDList: number[] = []
        for (const userID of userIDList) {
            if (this.map[userID]) {
                map[userID] = this.map[userID]
            } else {
                newUserIDList.push(userID)
            }
        }
        if (newUserIDList.length > 0) {
            const { infoMap } = await ViewerAPI.getUserInfoMapByIDList(newUserIDList)
            for (const userID of newUserIDList) {
                this.map[userID] = infoMap[userID]
                map[userID] = infoMap[userID]
            }
        }
        return map
    }
}
export default new UserInfoMap()
