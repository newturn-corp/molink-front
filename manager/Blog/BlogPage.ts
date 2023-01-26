import Blog from '../global/Blog/Blog'
import BlogInfoMap from '../global/Blog/BlogInfoMap'
import { BlogInfo } from '@newturn-develop/types-molink'
import { UserNotExists } from '../../Errors/UserError'

class BlogPage {
    async handleEnter (blogName: string) {
        const infoMap = await BlogInfoMap.getBlogInfoMapByNameList([blogName])
        const info = infoMap[blogName] as BlogInfo
        if (!info) {
            throw new UserNotExists()
        }
        const { id } = info
        await Blog.load(id)
        await Blog.blogPageList.loadPageSummaryList()
    }
}
export default new BlogPage()
