import { BlogInfo, ESUser } from '@newturn-develop/types-molink'
import { makeAutoObservable } from 'mobx'
import ViewerBlogAPI from '../../../api/Viewer/ViewerBlogAPI'
import ViewerAPI from '../../../api/ViewerAPI'

class UserInfoMap {
    idMap: { [index: number]: BlogInfo } = {}
    nameMap: { [index: string]: BlogInfo } = {}

    constructor () {
        makeAutoObservable(this)
    }

    async updateByIDList (idList: number[]) {
        const set = new Set<number>()
        idList.filter((id) => !this.idMap[id]).forEach(id => {
            set.add(id)
        })
        const newIDList: number[] = Array.from(set)
        if (newIDList.length === 0) {
            return
        }
        const { infoMap } = await ViewerBlogAPI.getBlogInfoMapByIDList(newIDList)
        for (const id of newIDList) {
            const info = infoMap[id]
            if (!info) {
                continue
            }
            this.idMap[id] = info
            this.nameMap[info.name] = info
        }
    }

    async getBlogInfoMapByBlogIDList (blogIDList: number[]) {
        const map: { [index: number]: BlogInfo } = {}
        const newBlogIDList: number[] = []
        for (const blogID of blogIDList) {
            if (this.idMap[blogID]) {
                map[blogID] = this.idMap[blogID]
            } else {
                newBlogIDList.push(blogID)
            }
        }
        if (newBlogIDList.length > 0) {
            const { infoMap } = await ViewerBlogAPI.getBlogInfoMapByIDList(newBlogIDList)
            for (const blogID of newBlogIDList) {
                const info = infoMap[blogID]
                if (!info) {
                    continue
                }
                this.idMap[blogID] = info
                this.nameMap[info.name] = info
                map[blogID] = info
            }
        }
        return map
    }

    async getBlogInfoMapByNameList (blogNameList: string[]) {
        const map: { [index: string]: BlogInfo } = {}
        const newBlogNameList: string[] = []
        for (const blogName of blogNameList) {
            if (this.nameMap[blogName]) {
                map[blogName] = this.nameMap[blogName]
            } else {
                newBlogNameList.push(blogName)
            }
        }
        if (newBlogNameList.length > 0) {
            const { infoMap } = await ViewerBlogAPI.getBlogInfoMapByNameList(newBlogNameList)
            for (const blogName of blogNameList) {
                const info = infoMap[blogName]
                if (!info) {
                    continue
                }
                this.nameMap[blogName] = info
                this.idMap[info.id] = info
                map[blogName] = info
            }
        }
        return map
    }
}
export default new UserInfoMap()
