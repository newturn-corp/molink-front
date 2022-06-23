import UserManager from '../global/User/UserManager'
import UserInfoMap from '../global/User/UserInfoMap'
import DialogManager from '../global/DialogManager'
import LanguageManager from '../global/LanguageManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import { PageList } from '../../domain/PageList'
import { ESUser, GetPageListDTO } from '@newturn-develop/types-molink'
import ViewerPageListAPI from '../../api/Viewer/ViewerPageListAPI'
import { makeAutoObservable } from 'mobx'
import { UserBlogInfo } from './UserBlogInfo'

class UserPage {
    userID: number
    info: ESUser = null
    pageList: PageList = null
    blogInfo: UserBlogInfo = null

    constructor () {
        makeAutoObservable(this)
    }

    async handleEnter (nickname: string) {
        await UserManager.load()
        const infoMap = await UserInfoMap.getUserInfoMapByUserNicknameList([nickname])
        const info = infoMap[nickname]
        if (!info) {
            await DialogManager.openDialog(LanguageManager.languageMap.UserNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
            await RoutingManager.moveTo(Page.Index)
        }
        this.info = info
        this.userID = Number(info.id)

        this.pageList = new PageList(6, async (from: number, count: number) => {
            const dto = await ViewerPageListAPI.getUserPageList(Number(info.id), new GetPageListDTO(from, count))
            return dto
        })
        this.pageList.loadPageSummaryList()

        this.blogInfo = new UserBlogInfo()
        await this.blogInfo.load(this.userID)
    }
}
export default new UserPage()
