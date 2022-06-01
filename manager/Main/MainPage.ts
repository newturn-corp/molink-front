import { makeAutoObservable } from 'mobx'
import { MainPagePageList } from './MainPagePageList'
import ViewerAPI from '../../api/ViewerAPI'
import { GetPageListDTO } from '@newturn-develop/types-molink'
import UserManager from '../global/User/UserManager'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import Blog from '../global/Blog/Blog'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import Hierarchy from '../global/Hierarchy/Hierarchy'
import { PageListViewType } from '../../Enums/PageListViewType'

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
        this.currentCategoryIndex = 0
        for (const pageList of this.pageLists) {
            pageList.clear()
        }
        this.pageLists[this.currentCategoryIndex].loadPageSummaryList()
        if (UserManager.isUserAuthorized) {
            await this._loadBlog()
        } else {
            const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
            if (currentHierarchy) {
                currentHierarchy.reset()
                HierarchyManager.currentHierarchyUserId = 0
                HierarchyManager.isHierarchyOpen = false
                HierarchyManager.hierarchyMap = new Map<number, Hierarchy>()
                Blog.clear()
            }
            EventManager.addDisposableEventListener(Event.UserAuthorization, async ({ result }: any) => {
                if (result) {
                    await this._loadBlog()
                }
            }, 1)
        }
    }

    private async _loadBlog () {
        await Blog.load(UserManager.userId)
        await Blog.loadBlogUserInfo()
        await HierarchyManager.loadHierarchy(UserManager.userId)
    }

    setCurrentCategoryIndex (index: number) {
        this.currentCategoryIndex = index
        console.log(index)
        this.pageLists[this.currentCategoryIndex].loadPageSummaryList()
    }
}
export default new MainPage()
