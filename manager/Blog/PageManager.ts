import { PageUserInfo } from './Page/PageUserInfo'
import EditorManager from './EditorManager'
import { BlogUserInfo } from './BlogUserInfo'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { makeAutoObservable } from 'mobx'

class PageManager {
    pageUserInfo: PageUserInfo
    blogUserInfo: BlogUserInfo

    constructor () {
        this.pageUserInfo = new PageUserInfo()
        this.blogUserInfo = new BlogUserInfo()
        EventManager.addEventListener(Event.LoadContent, async () => {
            if (!EditorManager.editable || EditorManager.isLocked) {
                await this.blogUserInfo.load(EditorManager.info.userId)
            }
        }, 1)
        EventManager.addEventListener(Event.LockPage, async ({ isLocked }: any) => {
            if (isLocked) {
                await this.blogUserInfo.load(EditorManager.info.userId)
            }
        }, 1)
        makeAutoObservable(this)
    }

    get pageFileVolumn () {
        return EditorManager.yInfo.get('page-file-volumn')
    }
}
export default new PageManager()
