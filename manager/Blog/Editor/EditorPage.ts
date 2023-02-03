import { makeAutoObservable } from 'mobx'
import { Editor } from './Editor'
import { CommentInfo } from './View/CommentInfo'
import { EditorPageBlogInfo } from './View/EditorPageBlogInfo'
import { EditorPageInfo } from './EditorPageInfo'
import Blog from '../../global/Blog/Blog'
import { EditorPageUserInfo } from './View/EditorPageUserInfo'
import UserManager from '../../global/User/UserManager'
import ViewerAPI from '../../../api/ViewerAPI'
import DialogManager from '../../global/DialogManager'
import LanguageManager from '../../global/LanguageManager'
import RoutingManager, { Page } from '../../global/RoutingManager'

class EditorPage {
    pageId: string
    editor: Editor = null
    commentInfo: CommentInfo = null
    blogInfo: EditorPageBlogInfo = null
    userInfo: EditorPageUserInfo = null
    pageInfo: EditorPageInfo = null

    constructor () {
        makeAutoObservable(this)
    }

    async handleEnter (pageId: string) {
        await UserManager.load()
        this.pageId = pageId
        const metaInfo = await ViewerAPI.getPageMetaInfo(pageId)
        const { blogID: pageBlogID, userId: pageUserID } = metaInfo
        await Blog.load(pageBlogID)
        if (!Blog.pageHierarchy.yMap.get(pageId)) {
            await DialogManager.openDialog('페이지가 존재하지 않습니다.', '메인 페이지로 이동합니다.', [LanguageManager.languageMap.Accept])
            await RoutingManager.moveTo(Page.Index)
            return
        }
        await Blog.pageHierarchy.openPage(pageId)

        this.editor = new Editor(metaInfo)
        this.commentInfo = new CommentInfo(pageId)
        this.blogInfo = new EditorPageBlogInfo(pageBlogID)
        this.pageInfo = new EditorPageInfo(pageId)
        this.userInfo = new EditorPageUserInfo(pageUserID)

        await Promise.all([
            this.editor.load(pageId),
            this.commentInfo.load(),
            this.blogInfo.load(),
            this.pageInfo.load(),
            this.userInfo.load()
        ])

        Blog.pageHierarchy.openPageParents(pageId)
    }
}
export default new EditorPage()
