import { observer } from 'mobx-react'
import React from 'react'
import { BlogUserInfoComponent } from '../../Blog/BlogUserInfoComponent'
import { UserPageListComponent } from '../../Home/Main/Content/UserPageListComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import GlobalManager from '../../../manager/global/GlobalManager'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import BlogPage from '../../../manager/Blog/BlogPage'

export const BlogUserContent: React.FC<{
}> = observer(() => {
    const blog = BlogPage.blog
    if (!blog) {
        return <></>
    }
    const blogUserInfo = BlogPage.blog.blogUserInfo
    const pageCount = BlogPage.blog.userPageList.totalPageCount

    return <div
        className={'blog-user-content'}
        style={{
            top: 0,
            height: GlobalManager.screenHeight - StyleManager.globalStyle.header.height,
            width: GlobalManager.screenWidth - HierarchyManager.getHierarchyWidth()
        }}
    >
        <BlogUserInfoComponent
            {...blogUserInfo}
            pageCount={pageCount}
        />
        <UserPageListComponent />
    </div>
})
