import Blog from '../../global/Blog/Blog'

class BlogUserInfoPage {
    async handleEnter (blogID: number) {
        await Blog.load(blogID)
        await Blog.blogPageList.loadPageSummaryList()
    }
}
export default new BlogUserInfoPage()
