import { makeAutoObservable } from 'mobx'
import { Editor } from './Editor'
import { CommentInfo } from './View/CommentInfo'
import { EditorPageBlogInfo } from './View/EditorPageBlogInfo'
import { EditorPageInfo } from './EditorPageInfo'
import Blog from '../../global/Blog/Blog'

class EditorPage {
    pageId: string
    editor: Editor = null
    commentInfo: CommentInfo = null
    blogInfo: EditorPageBlogInfo = null
    pageInfo: EditorPageInfo = null

    constructor () {
        makeAutoObservable(this)
    }

    async handleEnter (pageId: string, pageBlogID: number) {
        this.pageId = pageId
        await Blog.load(pageBlogID)
        Blog.pageHierarchy.openPage(pageId)

        this.editor = new Editor(Blog.pageHierarchy.openedPage.title)
        this.commentInfo = new CommentInfo(pageId)
        this.blogInfo = new EditorPageBlogInfo(pageBlogID)
        this.pageInfo = new EditorPageInfo(pageId)

        await Promise.all([
            this.editor.load(pageId),
            this.commentInfo.load(),
            this.blogInfo.load(),
            this.pageInfo.load()
        ])

        Blog.pageHierarchy.openPageParents(pageId)
    }
}
export default new EditorPage()
