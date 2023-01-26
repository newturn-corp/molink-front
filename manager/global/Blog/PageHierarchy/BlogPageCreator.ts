import ContentAPI from '../../../../api/ContentAPI'
import { CreatePageDTO, CreatePageInBlogDTO } from '@newturn-develop/types-molink'
import Blog from '../Blog'
import HierarchyAPI from '../../../../api/HierarchyAPI'
import RoutingManager, { Page } from '../../RoutingManager'

export class BlogPageCreator {
    isCreating: boolean = false

    async create (order:number, parentId: string | null) {
        if (this.isCreating) {
            return
        }
        this.isCreating = true
        const { id: newPageId } = await ContentAPI.createContentV2(new CreatePageDTO(null, null, null, null, Blog.id))
        await HierarchyAPI.createPageInBlog(new CreatePageInBlogDTO(newPageId, Blog.id, undefined, undefined, order, parentId))
        await RoutingManager.moveTo(Page.Editor, `/${newPageId}`)
        this.isCreating = false
    }
}
