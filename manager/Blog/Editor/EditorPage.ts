import { makeAutoObservable } from 'mobx'
import { Editor } from './Editor'
import { CommentInfo } from './View/CommentInfo'
import { EditorPageUserInfo } from './View/EditorPageUserInfo'
import { EditorPageInfo } from './EditorPageInfo'
import Blog from '../../global/Blog/Blog'

class EditorPage {
    pageId: string
    editor: Editor = null
    commentInfo: CommentInfo = null
    userInfo: EditorPageUserInfo = null
    pageInfo: EditorPageInfo = null

    constructor () {
        makeAutoObservable(this)
    }

    async handleEnter (pageId: string, userId: number) {
        this.pageId = pageId
        await Blog.load(userId)
        Blog.pageHierarchy.openPage(pageId)

        this.editor = new Editor(Blog.pageHierarchy.openedPage.title)
        this.commentInfo = new CommentInfo(pageId)
        this.userInfo = new EditorPageUserInfo(userId)
        this.pageInfo = new EditorPageInfo(pageId)

        await Promise.all([
            this.editor.load(pageId),
            this.commentInfo.load(),
            this.userInfo.load(),
            this.pageInfo.load()
        ])

        Blog.pageHierarchy.openPageParents(pageId)
    }
}
export default new EditorPage()
