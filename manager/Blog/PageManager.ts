import { PageUserInfo } from './Page/PageUserInfo'
import EditorManager from './EditorManager'
import { BlogUserInfo } from './BlogUserInfo'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { makeAutoObservable } from 'mobx'
import { PageCommentInfo } from './Page/PageCommentInfo'

class PageManager {
    pageUserInfo: PageUserInfo
    blogUserInfo: BlogUserInfo
    pageCommentInfo: PageCommentInfo

    constructor () {
        this.pageUserInfo = new PageUserInfo()
        this.blogUserInfo = new BlogUserInfo()
        this.pageCommentInfo = new PageCommentInfo()
        EventManager.addEventListener(Event.LoadContent, async () => {
            if (!EditorManager.editable || EditorManager.isLocked) {
                await this.pageUserInfo.load()
                await this.blogUserInfo.load(EditorManager.info.userId)
                await this.pageCommentInfo.load()
            }
        }, 1)
        EventManager.addEventListener(Event.LockPage, async ({ isLocked }: any) => {
            if (isLocked) {
                await this.blogUserInfo.load(EditorManager.info.userId)
                await this.pageCommentInfo.load()
            }
        }, 1)
        makeAutoObservable(this)
    }
}
export default new PageManager()
