import UserManager from '../global/User/UserManager'
import { makeAutoObservable } from 'mobx'
import { Editor } from '../Blog/Editor/Editor'
import Blog from '../global/Blog/Blog'

class NewEditorPage {
    pageId: string
    editor: Editor = null

    constructor () {
        makeAutoObservable(this)
    }

    async handleEnter (pageId: string) {
        await UserManager.load()
        this.pageId = pageId
        const { blogID: pageBlogID, userId: pageUserID } = pageMetaInfo
        await Blog.load(pageBlogID)
        Blog.pageHierarchy.openPage(pageId)

        this.editor = new Editor(pageMetaInfo)

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
export default new NewEditorPage()
