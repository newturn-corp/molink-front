import Blog from '../../global/Blog/Blog'

class BlogInfoPage {
    async handleEnter (blogID: number) {
        await Blog.load(blogID)
        await Blog.blogPageList.loadPageSummaryList()
    }
}
export default new BlogInfoPage()
