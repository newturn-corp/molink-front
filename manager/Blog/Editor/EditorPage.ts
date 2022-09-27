import { makeAutoObservable } from 'mobx'
import { Editor } from './Editor'
import { CommentInfo } from './View/CommentInfo'
import { EditorPageBlogInfo } from './View/EditorPageBlogInfo'
import { EditorPageInfo } from './EditorPageInfo'
import Blog from '../../global/Blog/Blog'
import { EditorPageUserInfo } from './View/EditorPageUserInfo'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import ViewerAPI from '../../../api/ViewerAPI'

class EditorPage {
    pageId: string
    editor: Editor = null

    constructor () {
        makeAutoObservable(this)
    }

    async handleEnter (pageId: string, pageMetaInfo: ESPageMetaInfo) {
        this.pageId = pageId
        const authority = (await ViewerAPI.getPageAuthority(pageId))
        if (!authority.editable) {

        }
        Blog.pageHierarchy.openPageParents(pageId)
    }
}
export default new EditorPage()
