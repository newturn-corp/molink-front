import { makeAutoObservable } from 'mobx'
import { MainPagePageList } from './MainPagePageList'
import ViewerAPI from '../../api/ViewerAPI'
import { GetPageListDTO } from '@newturn-develop/types-molink'
import UserManager from '../global/User/UserManager'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { PageListViewType } from '../../Enums/PageListViewType'
import Blog from '../global/Blog/Blog'

class MainPage {
    pageLists: MainPagePageList[] = []
    currentCategoryIndex: number = 0
    viewType: PageListViewType = PageListViewType.Table

    constructor () {
        makeAutoObservable(this)
        this.pageLists = [
            new MainPagePageList(16, async (from: number, count: number) => {
                const dto = await ViewerAPI.getPopularPageList(new GetPageListDTO(from, count))
                return dto
            }, 'Popular'),
            new MainPagePageList(16, async (from: number, count: number) => {
                const dto = await ViewerAPI.getFollowPageList(new GetPageListDTO(from, count))
                return dto
            }, 'Follow')
        ]
    }

    async handleEnter () {
        await UserManager.load()
        this.currentCategoryIndex = 0
        for (const pageList of this.pageLists) {
            pageList.clear()
        }
        this.pageLists[this.currentCategoryIndex].loadPageSummaryList()
        if (UserManager.isUserAuthorized) {
            await Blog.load(UserManager.userId)
        } else {
            Blog.reset()
            EventManager.addDisposableEventListener(Event.UserAuthorization, async ({ result }: any) => {
                if (result) {
                    await Blog.load(UserManager.userId)
                }
            }, 1)
        }
    }

    setCurrentCategoryIndex (index: number) {
        this.currentCategoryIndex = index
        this.pageLists[this.currentCategoryIndex].loadPageSummaryList()
    }
}
export default new MainPage()
