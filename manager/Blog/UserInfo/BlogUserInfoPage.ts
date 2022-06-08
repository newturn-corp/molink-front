import Blog from '../../global/Blog/Blog'

class BlogUserInfoPage {
    async handleEnter () {
        await Blog.userPageList.loadPageSummaryList()
    }
}
export default new BlogUserInfoPage()
