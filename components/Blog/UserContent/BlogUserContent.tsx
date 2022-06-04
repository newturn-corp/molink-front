import { observer } from 'mobx-react'
import React from 'react'
import { BlogUserInfoComponent } from '../../Blog/BlogUserInfoComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import GlobalManager from '../../../manager/global/GlobalManager'
import { PageListComponent } from '../../global/PageList/PageListComponent'
import { PageListViewType } from '../../../Enums/PageListViewType'
import Blog from '../../../manager/global/Blog/Blog'

export const BlogUserContent: React.FC<{
}> = observer(() => {
    const blogUserInfo = Blog.blogUserInfo
    const userPageList = Blog.userPageList
    const pageHierarchy = Blog.pageHierarchy
    if (!blogUserInfo || !userPageList) {
        return <></>
    }
    const pageCount = userPageList.totalPageCount

    return <div
        className={'blog-user-content'}
        style={{
            top: 0,
            height: GlobalManager.screenHeight - StyleManager.globalStyle.header.height,
            width: GlobalManager.screenWidth - Blog.getBlogWidth()
        }}
    >
        <BlogUserInfoComponent
            {...blogUserInfo}
            pageCount={pageCount}
        />
        <PageListComponent
            pageSummaryList={userPageList.pageSummaryList}
            isListEnded={userPageList.listEnded}
            onLoadPageList={async () => {
                await userPageList.loadPageSummaryList()
            }}
            viewType={PageListViewType.List}
        />
    </div>
})
